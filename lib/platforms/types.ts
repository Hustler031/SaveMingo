import type { MediaAsset, MediaContentType, Platform } from "@/lib/downloader/types";
import type { SaveMingoErrorCode } from "@/lib/errors";

export type PlatformValidationSuccess = {
  ok: true;
  platform: Platform;
  normalizedUrl: string;
  contentType: MediaContentType;
};

export type PlatformValidationFailure = {
  ok: false;
  code: SaveMingoErrorCode;
  message: string;
};

export type PlatformValidationResult =
  | PlatformValidationSuccess
  | PlatformValidationFailure;

export type AdapterResolveSuccess = {
  ok: true;
  provider: string;
  strategy?: string;
  contentType: MediaContentType;
  media: MediaAsset[];
};

export type AdapterResolveFailure = {
  ok: false;
  provider: string;
  code: SaveMingoErrorCode;
  message: string;
  diagnostic?: string;
  debug?: Record<string, unknown>;
};

export type AdapterResolveResult =
  | AdapterResolveSuccess
  | AdapterResolveFailure;

export type PlatformHealth = {
  platform: Platform;
  status: "healthy" | "degraded" | "disabled";
  providers: string[];
  capabilities: Record<string, string>;
};

export type PlatformAdapter = {
  platform: Platform;
  unexpectedErrorCode: SaveMingoErrorCode;
  resolve(input: PlatformValidationSuccess): Promise<AdapterResolveResult>;
  health(): PlatformHealth;
};
