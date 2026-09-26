import type { Platform } from "@/lib/downloader/types";
import { instagramAdapter } from "@/lib/platforms/instagram/adapter";
import type { PlatformAdapter } from "@/lib/platforms/types";
import { xAdapter } from "@/lib/platforms/x/adapter";

const REGISTRY: Record<Platform, PlatformAdapter> = {
  instagram: instagramAdapter,
  x: xAdapter,
};

export function getPlatformAdapter(platform: Platform) {
  return REGISTRY[platform];
}

export function platformHealth() {
  return Object.values(REGISTRY).map((adapter) => adapter.health());
}
