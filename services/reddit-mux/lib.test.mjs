import test from "node:test";
import assert from "node:assert/strict";
import {
  isAllowedRedditMuxUrl,
  safeOutputName,
  selectBestDashAudioUrl,
} from "./lib.mjs";

test("selects the highest-bandwidth Reddit DASH audio representation", () => {
  const manifest = `
    <MPD>
      <Period>
        <AdaptationSet contentType="video" mimeType="video/mp4">
          <Representation bandwidth="2500000">
            <BaseURL>DASH_720.mp4</BaseURL>
          </Representation>
        </AdaptationSet>
        <AdaptationSet contentType="audio" mimeType="audio/mp4">
          <Representation bandwidth="64000">
            <BaseURL>DASH_AUDIO_64.mp4</BaseURL>
          </Representation>
          <Representation bandwidth="128000">
            <BaseURL>DASH_AUDIO_128.mp4</BaseURL>
          </Representation>
        </AdaptationSet>
      </Period>
    </MPD>
  `;

  assert.equal(
    selectBestDashAudioUrl(
      manifest,
      "https://v.redd.it/example/DASHPlaylist.mpd",
    ),
    "https://v.redd.it/example/DASH_AUDIO_128.mp4",
  );
});

test("rejects non-Reddit mux URLs", () => {
  assert.equal(
    isAllowedRedditMuxUrl(
      "https://v.redd.it/example/DASH_720.mp4",
    ),
    true,
  );

  assert.equal(
    isAllowedRedditMuxUrl(
      "https://evil.example/DASH_AUDIO_128.mp4",
    ),
    false,
  );

  assert.equal(
    isAllowedRedditMuxUrl(
      "http://v.redd.it/example/DASH_AUDIO_128.mp4",
    ),
    false,
  );
});

test("sanitizes mux output filenames", () => {
  assert.equal(
    safeOutputName("../../reddit video with sound"),
    "reddit-video-with-sound",
  );
});
