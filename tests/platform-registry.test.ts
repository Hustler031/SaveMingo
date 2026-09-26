import { describe, expect, it } from "vitest";
import {
  getPlatformAdapter,
  platformHealth,
} from "@/lib/platforms/server-registry";

describe("platform adapter isolation", () => {
  it("registers Instagram and X as separate adapters", () => {
    const instagram = getPlatformAdapter("instagram");
    const x = getPlatformAdapter("x");

    expect(instagram.platform).toBe("instagram");
    expect(x.platform).toBe("x");
    expect(instagram).not.toBe(x);
    expect(instagram.unexpectedErrorCode).toBe("SM-IG-104");
    expect(x.unexpectedErrorCode).toBe("SM-X-104");
  });

  it("reports independent platform health entries", () => {
    expect(platformHealth()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          platform: "instagram",
          status: "healthy",
        }),
        expect.objectContaining({
          platform: "x",
          status: "healthy",
        }),
      ]),
    );
  });
});
