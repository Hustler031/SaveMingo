import { Container, getRandom } from "@cloudflare/containers";

const INSTANCE_COUNT = 2;

export class RedditMuxContainer extends Container {
  defaultPort = 8788;
  requiredPorts = [8788];
  sleepAfter = "30s";
  enableInternet = true;
  envVars = {
    PORT: "8788",
    MUX_INTERNAL_ONLY: "1",
    MUX_MAX_INPUT_BYTES: String(150 * 1024 * 1024),
    MUX_FETCH_TIMEOUT_MS: "25000",
    MUX_FFMPEG_TIMEOUT_MS: "60000",
  };
}

function json(status, body) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function forwardToContainer(request, env, path) {
  const container = await getRandom(
    env.REDDIT_MUX_CONTAINER,
    INSTANCE_COUNT,
  );

  const target = new URL(request.url);
  target.protocol = "http:";
  target.hostname = "container.internal";
  target.port = "";
  target.pathname = path;

  return container.fetch(new Request(target, request));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      if (url.searchParams.get("deep") !== "1") {
        return json(200, {
          service: "savemingo-reddit-mux-worker",
          status: "ready",
          container: "not-started",
        });
      }

      try {
        return await forwardToContainer(
          new Request("https://reddit-mux.internal/health", {
            method: "GET",
          }),
          env,
          "/health",
        );
      } catch {
        return json(503, {
          service: "savemingo-reddit-mux-worker",
          status: "unreachable",
          ffmpeg: false,
        });
      }
    }

    if (request.method === "POST" && url.pathname === "/mux") {
      const declared = Number.parseInt(
        request.headers.get("content-length") ?? "0",
        10,
      );

      if (Number.isFinite(declared) && declared > 16 * 1024) {
        return json(413, {
          success: false,
          error: "request-too-large",
        });
      }

      try {
        return await forwardToContainer(request, env, "/mux");
      } catch {
        return json(503, {
          success: false,
          error: "container-unavailable",
        });
      }
    }

    return json(404, {
      success: false,
      error: "not-found",
    });
  },
};
