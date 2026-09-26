import { spawn } from "node:child_process";
import { once } from "node:events";

const port = 8788;
const base = `http://127.0.0.1:${port}`;

const indexablePaths = [
  "/",
  "/instagram-downloader",
  "/instagram-reels-downloader",
  "/instagram-video-downloader",
  "/instagram-photo-downloader",
  "/instagram-carousel-downloader",
  "/x-downloader",
  "/twitter-video-downloader",
  "/twitter-gif-downloader",
  "/twitter-image-downloader",
  "/how-to-download-instagram-reels",
  "/about",
  "/privacy",
  "/terms",
  "/copyright",
];

const stagedNoindexPaths = [
  "/pinterest-downloader",
  "/pinterest-video-downloader",
  "/pinterest-image-downloader",
  "/pinterest-gif-downloader",
  "/reddit-downloader",
  "/reddit-video-downloader",
  "/reddit-image-downloader",
  "/reddit-gif-downloader",
  "/tiktok-downloader",
  "/tiktok-video-downloader",
  "/tiktok-photo-downloader",
  "/tiktok-slideshow-downloader",
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function canonicalFor(path) {
  return path === "/"
    ? ["https://savemingo.com", "https://savemingo.com/"]
    : ["https://savemingo.com" + path];
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
    if (child.exitCode === null) child.kill("SIGKILL");
  });

  await Promise.race([exited, forced]);
  child.stdout?.destroy();
  child.stderr?.destroy();
}

function assertIndexableHtml(html, path) {
  assert(html.includes("SaveMingo"), path + " is missing SaveMingo branding");
  assert(html.includes("<title"), path + " is missing title");
  assert(html.includes('name="description"'), path + " is missing description");
  assert(
    html.includes('rel="canonical"') &&
      canonicalFor(path).some((canonical) => html.includes(canonical)),
    path + " is missing the expected canonical",
  );
  assert(
    !/name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html) &&
      !/content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots["']/i.test(html),
    path + " unexpectedly contains noindex",
  );
}

function assertStagedHtml(html, path) {
  assert(html.includes("SaveMingo"), path + " is missing SaveMingo branding");
  assert(html.includes("<title"), path + " is missing title");
  assert(
    canonicalFor(path).some((canonical) => html.includes(canonical)),
    path + " is missing the expected canonical",
  );
  assert(
    /noindex/i.test(html),
    path + " must remain noindex until its production fixture gate passes",
  );
}

async function main() {
  const child = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    [
      "wrangler",
      "dev",
      "--config",
      "dist/server/wrangler.json",
      "--port",
      String(port),
    ],
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

    for (const path of indexablePaths) {
      const response = await fetch(base + path, { redirect: "manual" });
      const html = await response.text();
      assert(response.ok, `${path} failed with ${response.status}`);
      assertIndexableHtml(html, path);
      console.log("PASS indexable", path, response.status);
    }

    for (const path of stagedNoindexPaths) {
      const response = await fetch(base + path, { redirect: "manual" });
      const html = await response.text();
      assert(response.ok, `${path} failed with ${response.status}`);
      assertStagedHtml(html, path);
      console.log("PASS staged noindex", path, response.status);
    }

    const robots = await fetch(base + "/robots.txt");
    const robotsText = await robots.text();
    assert(robots.ok, "robots.txt failed");
    assert(robotsText.includes("sitemap.xml"), "robots.txt missing sitemap");
    assert(robotsText.includes("/v2-preview/"), "robots.txt must block legacy preview");
    console.log("PASS robots.txt", robots.status);

    const sitemap = await fetch(base + "/sitemap.xml");
    const sitemapText = await sitemap.text();
    assert(sitemap.ok, "sitemap.xml failed");
    for (const path of indexablePaths) {
      const canonical = canonicalFor(path)[0];
      assert(
        sitemapText.includes(canonical),
        "sitemap.xml is missing " + canonical,
      );
    }
    for (const path of stagedNoindexPaths) {
      assert(
        !sitemapText.includes("https://savemingo.com" + path),
        "staged noindex route leaked into sitemap: " + path,
      );
    }
    console.log("PASS sitemap indexability partition", sitemap.status);

    const preview = await fetch(base + "/v2-preview", { redirect: "manual" });
    const previewHtml = await preview.text();
    assert(preview.ok, "legacy preview route failed");
    assert(/noindex/i.test(previewHtml), "legacy preview route must remain noindex");
    console.log("PASS legacy preview noindex", preview.status);

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
