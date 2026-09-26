import type { SaveMingoErrorCode } from "@/lib/errors";

export type Platform = "instagram" | "x" | "pinterest" | "reddit";

export type InstagramContentType =
  | "reel"
  | "post"
  | "video"
  | "carousel"
  | "photo"
  | "unknown";

export type XContentType =
  | "post"
  | "video"
  | "photo"
  | "carousel"
  | "gif"
  | "unknown";

export type PinterestContentType =
  | "pin"
  | "video"
  | "photo"
  | "carousel"
  | "gif"
  | "idea"
  | "unknown";

export type RedditContentType =
  | "post"
  | "video"
  | "photo"
  | "gallery"
  | "gif"
  | "unknown";

export type MediaContentType =
  | InstagramContentType
  | XContentType
  | PinterestContentType
  | RedditContentType;

export type AudioStatus = "included" | "separate" | "none" | "unknown";

export type MediaAsset = {
  id: string;
  type: "video" | "image";
  url: string;
  thumbnailUrl?: string;
  quality?: string;
  width?: number;
  height?: number;
  audioStatus?: AudioStatus;
};

export type ResolveSuccess = {
  success: true;
  requestId: string;
  platform: Platform;
  contentType: MediaContentType;
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
