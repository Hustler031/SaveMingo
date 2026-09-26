import http from "node:http";
import { createReadStream, createWriteStream } from "node:fs";
import { mkdtemp, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable, Transform } from "node:stream";
import { spawn } from "node:child_process";
import ffmpegPath from "ffmpeg-static";
import {
  isAllowedRedditMuxUrl,
  safeOutputName,
  selectBestDashAudioUrl,
} from "./lib.mjs";

const PORT = Number.parseInt(process.env.PORT ?? "8788", 10);
const TOKEN = process.env.MUX_SERVICE_TOKEN ?? "";
const MAX_INPUT_BYTES = Number.parseInt(
  process.env.MUX_MAX_INPUT_BYTES ?? String(250 * 1024 * 1024),
  10,
);
const MAX_MANIFEST_BYTES = 1024 * 1024;
const FETCH_TIMEOUT_MS = Number.parseInt(
  process.env.MUX_FETCH_TIMEOUT_MS ?? "25000",
  10,
);
const FFMPEG_TIMEOUT_MS = Number.parseInt(
  process.env.MUX_FFMPEG_TIMEOUT_MS ?? "60000",
  10,
);
const MAX_REQUEST_BYTES = 16 * 1024;

function json(res, status, body) {
  const payload = Buffer.from(JSON.stringify(body));

  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": String(payload.byteLength),
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });

  res.end(payload);
}

function authorized(req) {
  if (!TOKEN) return false;
  return req.headers.authorization === "Bearer " + TOKEN;
}

async function readJson(req) {
  let size = 0;
  const chunks = [];

  for await (const chunk of req) {
    size += chunk.length;

    if (size > MAX_REQUEST_BYTES) {
      throw new Error("request-too-large");
    }

    chunks.push(chunk);
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function fetchAllowed(url, maxBytes, redirectCount = 0) {
  if (!isAllowedRedditMuxUrl(url)) {
    throw new Error("blocked-url");
  }

  const response = await fetch(url, {
    method: "GET",
    redirect: "manual",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: {
      "user-agent":
        "SaveMingo-Reddit-Mux/0.1 (+https://savemingo.com)",
      accept: "*/*",
      referer: "https://www.reddit.com/",
    },
  });

  if ([301, 302, 303, 307, 308].includes(response.status)) {
    const location = response.headers.get("location");

    if (!location) throw new Error("redirect-without-location");
    if (redirectCount >= 3) throw new Error("redirect-limit");

    const next = new URL(location, url).toString();

    if (!isAllowedRedditMuxUrl(next)) {
      throw new Error("blocked-redirect");
    }

    return fetchAllowed(next, maxBytes, redirectCount + 1);
  }

  if (!response.ok || !response.body) {
    throw new Error("upstream-" + String(response.status));
  }

  const declared = Number.parseInt(
    response.headers.get("content-length") ?? "0",
    10,
  );

  if (
    Number.isFinite(declared) &&
    declared > 0 &&
    declared > maxBytes
  ) {
    throw new Error("input-too-large");
  }

  return response;
}

async function fetchText(url, maxBytes) {
  const response = await fetchAllowed(url, maxBytes);
  const text = await response.text();

  if (Buffer.byteLength(text, "utf8") > maxBytes) {
    throw new Error("input-too-large");
  }

  return text;
}

async function downloadToFile(url, targetPath, maxBytes) {
  const response = await fetchAllowed(url, maxBytes);
  let seen = 0;

  const limiter = new Transform({
    transform(chunk, _encoding, callback) {
      seen += chunk.length;

      if (seen > maxBytes) {
        callback(new Error("input-too-large"));
        return;
      }

      callback(null, chunk);
    },
  });

  await pipeline(
    Readable.fromWeb(response.body),
    limiter,
    createWriteStream(targetPath, { flags: "wx" }),
  );
}

function runFfmpeg(videoPath, audioPath, outputPath) {
  return new Promise((resolve, reject) => {
    if (!ffmpegPath) {
      reject(new Error("ffmpeg-not-available"));
      return;
    }

    const child = spawn(
      ffmpegPath,
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        videoPath,
        "-i",
        audioPath,
        "-map",
        "0:v:0",
        "-map",
        "1:a:0",
        "-c",
        "copy",
        "-movflags",
        "+faststart",
        outputPath,
      ],
      {
        stdio: ["ignore", "ignore", "pipe"],
      },
    );

    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
    }, FFMPEG_TIMEOUT_MS);

    child.stderr.on("data", (chunk) => {
      if (stderr.length < 12000) {
        stderr += chunk.toString("utf8");
      }
    });

    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });

    child.on("close", (code, signal) => {
      clearTimeout(timer);

      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          "ffmpeg-failed:" +
            String(code ?? signal ?? "unknown") +
            ":" +
            stderr.slice(-2000),
        ),
      );
    });
  });
}

async function handleMux(req, res) {
  if (!authorized(req)) {
    json(res, 401, {
      success: false,
      error: "unauthorized",
    });
    return;
  }

  let body;

  try {
    body = await readJson(req);
  } catch (error) {
    json(res, 400, {
      success: false,
      error:
        error instanceof Error ? error.message : "invalid-json",
    });
    return;
  }

  const videoUrl =
    typeof body?.videoUrl === "string" ? body.videoUrl : "";
  const manifestUrl =
    typeof body?.manifestUrl === "string" ? body.manifestUrl : "";
  const fileName = safeOutputName(body?.fileName);

  if (
    !isAllowedRedditMuxUrl(videoUrl) ||
    !isAllowedRedditMuxUrl(manifestUrl)
  ) {
    json(res, 400, {
      success: false,
      error: "blocked-url",
    });
    return;
  }

  const workdir = await mkdtemp(
    path.join(os.tmpdir(), "savemingo-reddit-mux-"),
  );

  const videoPath = path.join(workdir, "video.mp4");
  const audioPath = path.join(workdir, "audio.mp4");
  const outputPath = path.join(workdir, "merged.mp4");

  try {
    const manifest = await fetchText(
      manifestUrl,
      MAX_MANIFEST_BYTES,
    );

    const audioUrl = selectBestDashAudioUrl(
      manifest,
      manifestUrl,
    );

    if (!audioUrl) {
      json(res, 422, {
        success: false,
        error: "audio-track-not-found",
      });
      return;
    }

    await Promise.all([
      downloadToFile(videoUrl, videoPath, MAX_INPUT_BYTES),
      downloadToFile(audioUrl, audioPath, MAX_INPUT_BYTES),
    ]);

    await runFfmpeg(videoPath, audioPath, outputPath);

    const outputStat = await stat(outputPath);

    res.writeHead(200, {
      "content-type": "video/mp4",
      "content-length": String(outputStat.size),
      "content-disposition":
        'attachment; filename="' + fileName + '.mp4"',
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
      "x-savemingo-mux": "reddit-dash-audio",
    });

    const stream = createReadStream(outputPath);

    stream.on("error", () => {
      res.destroy();
    });

    stream.pipe(res);

    await new Promise((resolve) => {
      res.once("close", resolve);
      res.once("finish", resolve);
    });
  } catch (error) {
    if (!res.headersSent) {
      json(res, 502, {
        success: false,
        error:
          error instanceof Error
            ? error.message.split("\n", 1)[0]
            : "mux-failed",
      });
    }
  } finally {
    await rm(workdir, {
      recursive: true,
      force: true,
    }).catch(() => {});
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    json(res, 200, {
      service: "savemingo-reddit-mux",
      status: ffmpegPath ? "healthy" : "degraded",
      ffmpeg: Boolean(ffmpegPath),
    });
    return;
  }

  if (req.method === "POST" && req.url === "/mux") {
    await handleMux(req, res);
    return;
  }

  json(res, 404, {
    success: false,
    error: "not-found",
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(
    "SaveMingo Reddit mux service listening on http://0.0.0.0:" +
      String(PORT),
  );
});
