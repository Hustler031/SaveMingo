const base = (process.env.SAVEMINGO_BASE_URL || "").replace(/\/$/, "");

if (!base) {
  throw new Error("SAVEMINGO_BASE_URL is required");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function jsonRequest(path, init = {}) {
  const response = await fetch(base + path, {
    redirect: "follow",
    ...init,
  });

  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      path + " returned non-JSON (" + response.status + "): " + text.slice(0, 200),
    );
  }

  return { response, data };
}

async function htmlRequest(path) {
  const response = await fetch(base + path, { redirect: "follow" });
  const html = await response.text();

  assert(response.ok, path + " failed with " + response.status);
  assert(html.includes("SaveMingo"), path + " is missing SaveMingo branding");

  return { response, html };
}

function assertSeo(html, path, expectedTitleFragment) {
  const canonical =
    path === "/" ? "https://savemingo.com" : "https://savemingo.com" + path;
  const canonicalAlternates =
    path === "/" ? [canonical, canonical + "/"] : [canonical];

  assert(
    html.toLowerCase().includes("<title"),
    path + " is missing a title element",
  );
  assert(
    html.includes(expectedTitleFragment),
    path + " title/content does not include expected phrase: " + expectedTitleFragment,
  );
  assert(
    html.includes('name="description"'),
    path + " is missing a meta description",
  );
  assert(
    html.includes('rel="canonical"') &&
      canonicalAlternates.some((value) => html.includes(value)),
    path + " is missing expected canonical " + canonical,
  );
}

async function assertLiveGaMeasurement() {
  const response = await fetch(base + "/", { redirect: "follow" });
  const html = await response.text();
  const matches = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)];
  const scriptUrls = [...new Set(matches.map((match) => match[1]))];

  let found = html.includes("G-ZXK1PRVH6X");

  for (const src of scriptUrls) {
    if (found) break;

    try {
      const url = new URL(src, base).toString();
      const scriptResponse = await fetch(url, { redirect: "follow" });
      if (!scriptResponse.ok) continue;

      const scriptText = await scriptResponse.text();
      if (scriptText.includes("G-ZXK1PRVH6X")) {
        found = true;
      }
    } catch {
      // Ignore an individual asset failure; the assertion below is authoritative.
    }
  }

  assert(found, "Live Worker bundles do not contain GA4 Measurement ID G-ZXK1PRVH6X");
  console.log("PASS GA4 measurement bundle", "G-ZXK1PRVH6X");
}

async function resolveInstagramWithRetry(label, url, attempts = 3) {
  let last;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    last = await jsonRequest("/api/v1/resolve", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (last.response.ok && last.data.success === true) {
      if (attempt > 1) {
        console.log("RECOVERED", label, "on attempt", attempt);
      }
      return last;
    }

    const code = last.data?.error?.code;
    const transient =
      last.response.status === 502 ||
      last.response.status === 504 ||
      code === "SM-IG-104" ||
      code === "SM-IG-105" ||
      code === "SM-API-201";

    if (!transient || attempt === attempts) {
      break;
    }

    console.log(
      "RETRY",
      label,
      "attempt",
      attempt,
      "status",
      last.response.status,
      "code",
      code || "unknown",
      "requestId",
      last.data?.requestId || "missing",
    );

    await sleep(1_500 * attempt);
  }

  return last;
}

async function main() {
  console.log("SaveMingo Cloudflare runtime smoke:", base);

  const seoPages = [
    ["/", "SaveMingo"],
    ["/instagram-downloader", "Instagram Downloader"],
    ["/instagram-reels-downloader", "Instagram Reels Downloader"],
    ["/instagram-video-downloader", "Instagram Video Downloader"],
    ["/instagram-photo-downloader", "Instagram Photo Downloader"],
    ["/instagram-carousel-downloader", "Instagram Carousel Downloader"],
    ["/how-to-download-instagram-reels", "How to Download Instagram Reels"],
    ["/about", "About"],
    ["/privacy", "Privacy"],
    ["/terms", "Terms"],
    ["/copyright", "Copyright"],
  ];

  for (const [path, expected] of seoPages) {
    const page = await htmlRequest(path);
    assertSeo(page.html, path, expected);
    console.log("PASS SEO", path, page.response.status);
  }

  await assertLiveGaMeasurement();

  const robots = await fetch(base + "/robots.txt");
  const robotsText = await robots.text();
  assert(robots.ok, "robots.txt failed with " + robots.status);
  assert(
    robotsText.includes("https://savemingo.com/sitemap.xml"),
    "robots.txt does not reference canonical sitemap",
  );
  console.log("PASS robots.txt", robots.status);

  const sitemap = await fetch(base + "/sitemap.xml");
  const sitemapText = await sitemap.text();
  assert(sitemap.ok, "sitemap.xml failed with " + sitemap.status);
  assert(
    sitemapText.includes("https://savemingo.com/instagram-downloader"),
    "sitemap.xml is missing Instagram downloader canonical URL",
  );
  assert(
    sitemapText.includes("https://savemingo.com/instagram-reels-downloader"),
    "sitemap.xml is missing Reels canonical URL",
  );
  console.log("PASS sitemap.xml", sitemap.status);

  const manifest = await fetch(base + "/manifest.webmanifest");
  const manifestData = await manifest.json();
  assert(manifest.ok, "manifest failed with " + manifest.status);
  assert(manifestData.name === "SaveMingo", "manifest name is incorrect");
  assert(manifestData.start_url === "/", "manifest start_url is incorrect");
  console.log("PASS manifest", manifest.status);

  const missing = await fetch(base + "/this-page-should-not-exist-smoke", {
    redirect: "manual",
  });
  const missingHtml = await missing.text();
  assert(missing.status === 404, "Missing page should return 404");
  assert(
    missingHtml.includes("This page wandered off"),
    "Custom 404 content is missing",
  );
  console.log("PASS 404", missing.status);

  const health = await jsonRequest("/api/health");
  assert(health.response.ok, "/api/health failed with " + health.response.status);
  assert(health.data.status === "healthy", "Health status is not healthy");
  console.log(
    "PASS health",
    health.data.version,
    health.data.phase,
    health.data.requestId,
  );

  const resolverHealth = await jsonRequest("/api/health/resolver");
  assert(
    resolverHealth.response.ok,
    "/api/health/resolver failed with " + resolverHealth.response.status,
  );
  assert(
    resolverHealth.data.status === "healthy",
    "Resolver health is not healthy",
  );
  console.log(
    "PASS resolver health",
    resolverHealth.data.version,
    resolverHealth.data.requestId,
  );

  const invalid = await jsonRequest("/api/v1/resolve", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url: "https://example.com/not-instagram" }),
  });
  assert(invalid.response.status === 400, "Invalid URL should return 400");
  assert(invalid.data.success === false, "Invalid URL should fail");
  assert(
    invalid.data.error?.code === "SM-URL-001" ||
      invalid.data.error?.code === "SM-URL-002",
    "Unexpected invalid URL code: " + invalid.data.error?.code,
  );
  console.log("PASS invalid-url contract", invalid.data.error.code, invalid.data.requestId);

  const reelUrl = "https://www.instagram.com/reel/DH56yy7p3lZ/";
  const reel = await resolveInstagramWithRetry("reel", reelUrl);
  assert(
    reel.response.ok,
    "Reel resolve failed with " +
      reel.response.status +
      " code=" +
      (reel.data.error?.code || "unknown"),
  );
  assert(reel.data.success === true, "Reel resolve returned failure");
  assert(Array.isArray(reel.data.media) && reel.data.media.length > 0, "Reel returned no media");
  assert(reel.data.media.some((item) => item.type === "video"), "Reel returned no video media");
  console.log(
    "PASS reel resolve",
    reel.data.contentType,
    reel.data.media.length,
    reel.data.requestId,
  );

  const carouselUrl = "https://www.instagram.com/p/DcA6fTgIJ97/";
  const carousel = await resolveInstagramWithRetry("carousel", carouselUrl);
  assert(
    carousel.response.ok,
    "Carousel resolve failed with " +
      carousel.response.status +
      " code=" +
      (carousel.data.error?.code || "unknown") +
      " requestId=" +
      (carousel.data.requestId || "missing"),
  );
  assert(carousel.data.success === true, "Carousel resolve returned failure");
  assert(
    Array.isArray(carousel.data.media) && carousel.data.media.length >= 2,
    "Carousel returned fewer than 2 media items",
  );
  console.log(
    "PASS carousel resolve",
    carousel.data.contentType,
    carousel.data.media.length,
    carousel.data.requestId,
  );

  let video = reel.data.media.find((item) => item.type === "video");
  assert(video?.url, "No Reel media URL available for delivery test");

  let mediaResponse;
  let deliveryRequestId = "missing";

  for (let attempt = 1; attempt <= 2; attempt++) {
    const mediaUrl =
      base +
      "/api/v1/media?src=" +
      encodeURIComponent(video.url) +
      "&name=cloudflare-smoke";

    const controller = new AbortController();
    mediaResponse = await fetch(mediaUrl, {
      headers: { Range: "bytes=0-1023" },
      redirect: "manual",
      signal: controller.signal,
    });

    deliveryRequestId =
      mediaResponse.headers.get("x-savemingo-request-id") || "missing";

    if (mediaResponse.status === 200 || mediaResponse.status === 206) {
      controller.abort();
      break;
    }

    controller.abort();

    if (attempt === 2) break;

    console.log(
      "RETRY media delivery",
      "status",
      mediaResponse.status,
      "requestId",
      deliveryRequestId,
    );

    const freshReel = await resolveInstagramWithRetry("reel-refresh", reelUrl, 2);
    assert(freshReel.response.ok && freshReel.data.success, "Could not refresh Reel media URL");
    video = freshReel.data.media.find((item) => item.type === "video");
    assert(video?.url, "Refreshed Reel returned no video");
  }

  const mediaType = mediaResponse.headers.get("content-type") || "";
  const disposition = mediaResponse.headers.get("content-disposition") || "";

  assert(
    mediaResponse.status === 200 || mediaResponse.status === 206,
    "Media delivery failed with " +
      mediaResponse.status +
      " requestId=" +
      deliveryRequestId,
  );
  assert(
    mediaType.startsWith("video/") ||
      mediaType.startsWith("image/") ||
      mediaType === "application/octet-stream",
    "Unexpected media content type: " + mediaType,
  );
  assert(
    disposition.toLowerCase().includes("attachment"),
    "Media response is missing attachment disposition",
  );

  console.log(
    "PASS media delivery",
    mediaResponse.status,
    mediaType,
    deliveryRequestId,
  );

  console.log("ALL CLOUDFLARE LAUNCH-RUNTIME TESTS PASSED");
}

main().catch((error) => {
  console.error("CLOUDFLARE LAUNCH-RUNTIME SMOKE FAILED");
  console.error(error instanceof Error ? error.stack : error);
  process.exit(1);
});
