import type { Platform } from "@/lib/downloader/types";
import { instagramAdapter } from "@/lib/platforms/instagram/adapter";
import { pinterestAdapter } from "@/lib/platforms/pinterest/adapter";
import { redditAdapter } from "@/lib/platforms/reddit/adapter";
import { tiktokAdapter } from "@/lib/platforms/tiktok/adapter";
import type { PlatformAdapter } from "@/lib/platforms/types";
import { xAdapter } from "@/lib/platforms/x/adapter";

const REGISTRY: Record<Platform, PlatformAdapter> = {
  instagram: instagramAdapter,
  x: xAdapter,
  pinterest: pinterestAdapter,
  reddit: redditAdapter,
  tiktok: tiktokAdapter,
};

export function getPlatformAdapter(platform: Platform) {
  return REGISTRY[platform];
}

export function platformHealth() {
  return Object.values(REGISTRY).map((adapter) => adapter.health());
}
