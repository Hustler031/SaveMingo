import type { SaveMingoErrorCode } from "@/lib/errors";

export type Platform = "instagram";

export type InstagramContentType =
  | "reel"
  | "post"
  | "video"
  | "carousel"
  | "photo"
  | "unknown";

export type MediaAsset = {
  id: string;
  type: "video" | "image";
  url: string;
  thumbnailUrl?: string;
  quality?: string;
  width?: number;
  height?: number;
};

export type ResolveSuccess = {
  success: true;
  requestId: string;
  platform: Platform;
  contentType: InstagramContentType;
  sourceUrl: string;
  media: MediaAsset[];
};

export type ResolveFailure = {
  success: false;
  requestId: string;
  error: {
    code: SaveMingoErrorCode;
    message: string;
  };
};

export type ResolveResponse = ResolveSuccess | ResolveFailure;

export type DownloaderPhase =
  | "idle"
  | "validating"
  | "validated"
  | "resolving"
  | "success"
  | "error";

export type DownloaderUiError = {
  code: SaveMingoErrorCode;
  message: string;
  requestId: string;
};
