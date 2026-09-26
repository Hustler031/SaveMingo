const base = (process.env.SAVEMINGO_BASE_URL || "").replace(/\/$/, "");

if (!base) {
  throw new Error("SAVEMINGO_BASE_URL is required");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
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

async function main() {
  console.log("SaveMingo Cloudflare runtime smoke:", base);

  const home = await fetch(base + "/", { redirect: "follow" });
  assert(home.ok, "Homepage failed with " + home.status);
  const homeText = await home.text();
  assert(homeText.includes("SaveMingo"), "Homepage does not contain SaveMingo branding");
  console.log("PASS homepage", home.status);

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
  const reel = await jsonRequest("/api/v1/resolve", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url: reelUrl }),
  });
  assert(reel.response.ok, "Reel resolve failed with " + reel.response.status);
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
  const carousel = await jsonRequest("/api/v1/resolve", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url: carouselUrl }),
  });
  assert(
    carousel.response.ok,
    "Carousel resolve failed with " + carousel.response.status +
      " code=" + (carousel.data.error?.code || "unknown"),
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

  const video = reel.data.media.find((item) => item.type === "video");
  assert(video?.url, "No Reel media URL available for delivery test");

  const mediaUrl =
    base +
    "/api/v1/media?src=" +
    encodeURIComponent(video.url) +
    "&name=cloudflare-smoke";

  const controller = new AbortController();
  const mediaResponse = await fetch(mediaUrl, {
    headers: { Range: "bytes=0-1023" },
    redirect: "manual",
    signal: controller.signal,
  });

  const mediaType = mediaResponse.headers.get("content-type") || "";
  const disposition = mediaResponse.headers.get("content-disposition") || "";
  const deliveryRequestId =
    mediaResponse.headers.get("x-savemingo-request-id") || "missing";

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

  controller.abort();
  console.log(
    "PASS media delivery",
    mediaResponse.status,
    mediaType,
    deliveryRequestId,
  );

  console.log("ALL CLOUDFLARE RUNTIME SMOKE TESTS PASSED");
}

main().catch((error) => {
  console.error("CLOUDFLARE RUNTIME SMOKE FAILED");
  console.error(error instanceof Error ? error.stack : error);
  process.exit(1);
});
