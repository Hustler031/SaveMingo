import { spawn } from "node:child_process";
import { once } from "node:events";

const port = 8788;
const base = `http://127.0.0.1:${port}`;

const requiredPaths = [
  "/",
  "/instagram-downloader",
  "/instagram-reels-downloader",
  "/instagram-video-downloader",
  "/instagram-photo-downloader",
  "/instagram-carousel-downloader",
  "/how-to-download-instagram-reels",
  "/about",
  "/privacy",
  "/terms",
  "/copyright",
  "/robots.txt",
  "/sitemap.xml",
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(timeoutMs = 30_000) {
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(base + "/api/health");
      if (response.ok) return;
    } catch {}

    await sleep(500);
  }

  throw new Error("Local Cloudflare-compatible server did not become ready");
}

async function stopChild(child) {
  if (child.exitCode !== null || child.killed) return;

  child.kill("SIGTERM");

  const exited = once(child, "exit");
  const forced = sleep(2_000).then(() => {
    if (child.exitCode === null) {
      child.kill("SIGKILL");
    }
  });

  await Promise.race([exited, forced]);
  child.stdout?.destroy();
  child.stderr?.destroy();
}

async function main() {
  const child = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["wrangler", "dev", "--config", "dist/server/wrangler.json", "--port", String(port)],
    {
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        WRANGLER_SEND_METRICS: "false",
      },
    },
  );

  let output = "";

  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });

  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  try {
    await waitForServer();

    for (const path of requiredPaths) {
      const response = await fetch(base + path, { redirect: "manual" });

      if (!response.ok) {
        throw new Error(`${path} failed with ${response.status}`);
      }

      const text = await response.text();

      if (path.endsWith(".xml")) {
        if (!text.includes("savemingo.com")) {
          throw new Error(`${path} does not contain canonical SaveMingo URLs`);
        }
      } else if (path === "/robots.txt") {
        if (!text.includes("sitemap.xml")) {
          throw new Error("robots.txt does not reference sitemap.xml");
        }
      } else if (!text.includes("SaveMingo")) {
        throw new Error(`${path} does not contain SaveMingo branding`);
      }

      console.log("PASS", path, response.status);
    }

    console.log("ALL LOCAL CLOUDFLARE SEO ROUTES PASSED");
  } catch (error) {
    console.error(output);
    throw error;
  } finally {
    await stopChild(child);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.stack : error);
    process.exit(1);
  });
