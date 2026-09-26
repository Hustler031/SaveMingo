import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";

const base = (process.env.SAVEMINGO_BASE_URL || "").replace(/\/$/, "");
const fixtures = (
  process.env.SAVEMINGO_REDDIT_SOUND_FIXTURES ||
  [
    "https://www.reddit.com/r/aww/s/nMEhJAPgdZ",
    "https://www.reddit.com/r/aww/s/u5K71BNnNB",
  ].join(",")
)
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

if (!base) throw new Error("SAVEMINGO_BASE_URL is required");
if (!ffmpegPath) throw new Error("ffmpeg-static is unavailable");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function json(pathname, init) {
  const response = await fetch(base + pathname, init);
  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      pathname +
        " returned non-JSON " +
        response.status +
        ": " +
        text.slice(0, 200),
    );
  }

  return { response, data };
}

async function resolveSoundFixture() {
  const failures = [];

  for (const fixture of fixtures) {
    const result = await json("/api/v1/resolve", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: fixture }),
    });

    if (!result.response.ok || result.data?.success !== true) {
      failures.push(
        fixture +
          " resolve=" +
          result.response.status +
          "/" +
          (result.data?.error?.code || "unknown"),
      );
      continue;
    }

    const video = result.data.media?.find(
      (item) =>
        item.type === "video" &&
        item.audioStatus === "separate" &&
        item.merge?.strategy === "dash-audio" &&
        item.merge?.manifestUrl,
    );

    if (!video) {
      failures.push(fixture + " did not expose a separate audio track");
      continue;
    }

    return { fixture, result: result.data, video };
  }

  throw new Error(
    "No Reddit sound fixture reached the mux gate: " + failures.join("; "),
  );
}

function analyzeAudio(filePath) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      ffmpegPath,
      [
        "-hide_banner",
        "-i",
        filePath,
        "-map",
        "0:a:0",
        "-af",
        "volumedetect",
        "-f",
        "null",
        "-",
      ],
      { stdio: ["ignore", "ignore", "pipe"] },
    );

    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            "Merged MP4 does not expose a readable audio stream: " +
              stderr.slice(-1000),
          ),
        );
        return;
      }

      const match = stderr.match(/mean_volume:\s*([^\s]+)\s*dB/i);
      if (!match || match[1].toLowerCase() === "-inf") {
        reject(
          new Error(
            "Merged MP4 audio stream is silent or could not be measured",
          ),
        );
        return;
      }

      resolve({
        meanVolumeDb: match[1],
        diagnostic: stderr.slice(-1600),
      });
    });
  });
}

async function main() {
  console.log("Reddit mux production smoke:", base);

  const health = await json("/api/health/reddit-mux");
  assert(
    health.response.ok &&
      health.data?.status === "healthy" &&
      health.data?.ffmpeg === true,
    "Reddit mux deep health is not healthy",
  );
  assert(
    health.data?.runtime === "cloudflare-container",
    "Reddit mux health is not reporting the Cloudflare container runtime",
  );
  console.log("PASS mux health", health.data.runtime);

  const { fixture, result, video } = await resolveSoundFixture();
  console.log(
    "PASS Reddit separate-audio resolve",
    fixture,
    result.requestId,
  );

  const muxResponse = await fetch(base + "/api/v1/reddit/mux", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      videoUrl: video.url,
      manifestUrl: video.merge.manifestUrl,
      fileName: "savemingo-production-smoke",
    }),
  });

  assert(
    muxResponse.ok,
    "Reddit mux failed with status " + muxResponse.status,
  );
  assert(
    (muxResponse.headers.get("content-type") || "").startsWith("video/mp4"),
    "Reddit mux did not return video/mp4",
  );
  assert(
    muxResponse.headers.get("x-savemingo-mux") === "cloudflare-container",
    "Reddit mux response did not come through the Cloudflare container path",
  );

  const bytes = new Uint8Array(await muxResponse.arrayBuffer());
  assert(bytes.byteLength > 10_000, "Merged MP4 is unexpectedly small");

  const workdir = await mkdtemp(
    path.join(os.tmpdir(), "savemingo-reddit-prod-smoke-"),
  );
  const filePath = path.join(workdir, "merged.mp4");

  try {
    await writeFile(filePath, bytes);
    const audio = await analyzeAudio(filePath);
    console.log(
      "PASS merged MP4 contains audible audio",
      "mean_volume=" + audio.meanVolumeDb + "dB",
      "bytes=" + bytes.byteLength,
    );
  } finally {
    await rm(workdir, { recursive: true, force: true });
  }

  const videoOnlyUrl =
    base +
    "/api/v1/media?src=" +
    encodeURIComponent(video.url) +
    "&name=reddit-video-only-smoke";
  const fallback = await fetch(videoOnlyUrl, {
    headers: { Range: "bytes=0-1023" },
  });
  assert(
    fallback.status === 200 || fallback.status === 206,
    "Reddit video-only fallback failed with " + fallback.status,
  );
  console.log("PASS Reddit video-only fallback", fallback.status);

  console.log("ALL REDDIT CLOUDFLARE MUX PRODUCTION CHECKS PASSED");
}

main().catch((error) => {
  console.error("REDDIT CLOUDFLARE MUX PRODUCTION SMOKE FAILED");
  console.error(error instanceof Error ? error.stack : error);
  process.exit(1);
});
