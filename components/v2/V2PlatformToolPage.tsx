import Link from "next/link";
import { V2Downloader } from "@/components/v2/V2Downloader";
import { V2SiteShell } from "@/components/v2/V2SiteShell";
import type { Platform } from "@/lib/downloader/types";

export type V2PlatformPageKind =
  | "x-all"
  | "x-video"
  | "x-gif"
  | "x-image"
  | "pinterest-all"
  | "pinterest-video"
  | "pinterest-image"
  | "pinterest-gif"
  | "reddit-all"
  | "reddit-video"
  | "reddit-image"
  | "reddit-gif"
  | "tiktok-all"
  | "tiktok-video"
  | "tiktok-photo"
  | "tiktok-slideshow";

type Config = {
  platform: Extract<Platform, "x" | "pinterest" | "reddit" | "tiktok">;
  eyebrow: string;
  title: string;
  intro: string;
  sectionTitle: string;
  sectionText: string;
  supported: Array<[string, string]>;
  steps: string[];
  faq: Array<[string, string]>;
  related: Array<[string, string]>;
};

const xRelated: Array<[string, string]> = [
  ["/v2-preview/x-downloader", "X / Twitter Downloader"],
  ["/v2-preview/twitter-video-downloader", "Twitter Video"],
  ["/v2-preview/twitter-gif-downloader", "Twitter GIF"],
  ["/v2-preview/twitter-image-downloader", "Twitter Images"],
];

const pinterestRelated: Array<[string, string]> = [
  ["/v2-preview/pinterest-downloader", "Pinterest Downloader"],
  ["/v2-preview/pinterest-video-downloader", "Pinterest Video"],
  ["/v2-preview/pinterest-image-downloader", "Pinterest Images"],
  ["/v2-preview/pinterest-gif-downloader", "Pinterest GIF"],
];

const redditRelated: Array<[string, string]> = [
  ["/v2-preview/reddit-downloader", "Reddit Downloader"],
  ["/v2-preview/reddit-video-downloader", "Reddit Video + Sound Check"],
  ["/v2-preview/reddit-image-downloader", "Reddit Images"],
  ["/v2-preview/reddit-gif-downloader", "Reddit GIF"],
];

const tiktokRelated: Array<[string, string]> = [
  ["/v2-preview/tiktok-downloader", "TikTok Downloader"],
  ["/v2-preview/tiktok-video-downloader", "TikTok Video"],
  ["/v2-preview/tiktok-photo-downloader", "TikTok Photos"],
  ["/v2-preview/tiktok-slideshow-downloader", "TikTok Slideshow"],
];

const configs: Record<V2PlatformPageKind, Config> = {
  "x-all": {
    platform: "x",
    eyebrow: "X / Twitter Downloader",
    title: "Download videos, GIFs and images from X",
    intro:
      "Paste a supported public X or Twitter post link. SaveMingo finds the available video, animated GIF, photo, or multi-image media without requiring an X login.",
    sectionTitle: "One X post link. The right media automatically.",
    sectionText:
      "Old twitter.com links and current x.com links use the same downloader. SaveMingo detects the media type after you paste the post URL.",
    supported: [
      ["X videos", "Download supported public X and Twitter video posts."],
      ["Twitter GIFs", "Animated GIF posts are delivered as the available looping video source."],
      ["Images", "Save supported public X photos and multi-image posts."],
      ["No login", "Public post links work without asking for your X account password."],
    ],
    steps: [
      "On X or Twitter, open the public post and copy its link.",
      "Paste the x.com or twitter.com URL into SaveMingo.",
      "Download the available media, or open Preview first if you want to inspect it.",
    ],
    faq: [
      ["Do twitter.com links still work?", "Yes. SaveMingo accepts supported legacy twitter.com post links and current x.com post links."],
      ["Can I download X videos on iPhone or Android?", "The SaveMingo flow is browser-based and designed to work on modern mobile browsers as well as desktop."],
      ["Can I download Twitter GIFs?", "Supported animated GIF posts are resolved to the video source X uses for playback."],
      ["Can it download protected X posts?", "No. SaveMingo does not bypass protected-account or private-access controls."],
    ],
    related: xRelated,
  },
  "x-video": {
    platform: "x",
    eyebrow: "Twitter Video Downloader",
    title: "Twitter / X Video Downloader",
    intro:
      "Paste a public tweet or X post URL and download the available MP4 video. No X login, app install, or browser extension is required.",
    sectionTitle: "Save public Twitter and X videos in a few clicks.",
    sectionText:
      "When X exposes more than one MP4 variant, SaveMingo selects the highest-bitrate available MP4 source.",
    supported: [
      ["MP4 video", "Save the available public X video source as MP4."],
      ["Best available", "Prefer the strongest MP4 variant exposed by the post."],
      ["x.com + twitter.com", "Both current and legacy post links are accepted."],
      ["Mobile friendly", "Use the same downloader on iPhone, Android, or desktop."],
    ],
    steps: [
      "Copy the public X or Twitter post link containing the video.",
      "Paste it into the Twitter video downloader above.",
      "Press Download and save the available MP4.",
    ],
    faq: [
      ["How do I download a video from X?", "Copy the public post link, paste it above, and press Download."],
      ["Does SaveMingo reduce Twitter video quality?", "SaveMingo uses the available MP4 variants exposed for the public post and prefers the strongest available source."],
      ["Do I need to log in to Twitter?", "No. The downloader is for supported publicly accessible posts."],
      ["Does it work with old Twitter URLs?", "Yes. Supported twitter.com status links are normalized to the same X resolver."],
    ],
    related: xRelated,
  },
  "x-gif": {
    platform: "x",
    eyebrow: "Twitter GIF Downloader",
    title: "Download GIFs from Twitter / X",
    intro:
      "Paste a supported public X or Twitter post containing an animated GIF. X commonly serves GIF-style posts as looping video, so SaveMingo downloads the available video source.",
    sectionTitle: "Twitter GIFs without pretending they are always .gif files.",
    sectionText:
      "Animated content on X is often stored and delivered as video. SaveMingo keeps that real source instead of fabricating a format conversion.",
    supported: [
      ["Animated posts", "Resolve supported public GIF-style X posts."],
      ["Real source", "Download the looping media source X actually exposes."],
      ["No conversion", "No fake .gif conversion or quality claim."],
      ["No login", "Use supported public post links without account credentials."],
    ],
    steps: [
      "Copy the public X post link containing the GIF.",
      "Paste it into SaveMingo.",
      "Download the available looping media source.",
    ],
    faq: [
      ["Why does a Twitter GIF download as MP4?", "X often stores animated GIF-style posts as looping video. SaveMingo returns the available media source rather than relabeling it."],
      ["Can I convert the MP4 to GIF later?", "Yes, but SaveMingo does not currently perform that conversion."],
      ["Can I download a GIF from a protected account?", "No. Protected or private-access content is not supported."],
    ],
    related: xRelated,
  },
  "x-image": {
    platform: "x",
    eyebrow: "Twitter Image Downloader",
    title: "Download images from Twitter / X",
    intro:
      "Paste a supported public X post link to save its available photo or multi-image media. Preview is optional and the download action stays primary.",
    sectionTitle: "Save public X photos from one post link.",
    sectionText:
      "For posts with multiple media items, SaveMingo keeps them together so you can download the available items without opening each image manually.",
    supported: [
      ["Photos", "Save supported public X image posts."],
      ["Multi-image posts", "Handle several media items from the same post."],
      ["Original CDN source", "Use the public media source exposed by X."],
      ["Download all", "Multi-item results can use the shared Download All flow."],
    ],
    steps: [
      "Copy the public X or Twitter post URL containing the image.",
      "Paste the link above.",
      "Download the available photo or all media items.",
    ],
    faq: [
      ["Can SaveMingo download multiple Twitter images?", "If the public post exposes multiple downloadable media items, SaveMingo returns them together."],
      ["Do I need the direct pbs.twimg.com image link?", "No. Paste the public X or Twitter post link."],
      ["Does Preview open automatically?", "No. Preview remains optional."],
    ],
    related: xRelated,
  },
  "pinterest-all": {
    platform: "pinterest",
    eyebrow: "Pinterest Downloader",
    title: "Download Pinterest videos and images",
    intro:
      "Paste a supported public Pinterest pin link or pin.it share link. SaveMingo finds the available pin video or image without asking for a Pinterest login.",
    sectionTitle: "One Pinterest downloader for public pin media.",
    sectionText:
      "Video pins and image pins use the same box. Short pin.it links are resolved server-side when Pinterest keeps the pin publicly accessible.",
    supported: [
      ["Video pins", "Download supported public Pinterest video pins."],
      ["Image pins", "Save supported public Pinterest images."],
      ["pin.it links", "Short Pinterest share links are accepted."],
      ["No login", "Public pins do not require your Pinterest credentials."],
    ],
    steps: [
      "Open the public Pinterest pin and choose Copy link.",
      "Paste the pinterest.com/pin or pin.it link into SaveMingo.",
      "Download the available video or image.",
    ],
    faq: [
      ["Does SaveMingo support pin.it links?", "Yes. Supported pin.it share links are followed to their public Pinterest pin before media resolution."],
      ["Can I download Pinterest videos on mobile?", "The downloader is browser-based and designed for modern mobile and desktop browsers."],
      ["Can it download secret-board pins?", "No. Private or secret-board content is not supported."],
      ["Does SaveMingo add a watermark?", "SaveMingo does not add a watermark to the media source it delivers."],
    ],
    related: pinterestRelated,
  },
  "pinterest-video": {
    platform: "pinterest",
    eyebrow: "Pinterest Video Downloader",
    title: "Pinterest Video Downloader",
    intro:
      "Paste a public Pinterest video pin and download the available MP4 source. Supports regular pinterest.com pin URLs and supported pin.it share links.",
    sectionTitle: "Save public Pinterest video pins as MP4.",
    sectionText:
      "SaveMingo checks the public pin page for the video source Pinterest exposes and keeps download as the primary action.",
    supported: [
      ["MP4 video", "Download supported public Pinterest video pins."],
      ["HD when available", "Use the strongest public video source the pin exposes."],
      ["pin.it support", "Paste short share links without manually expanding them first."],
      ["No app install", "Use the web downloader directly in your browser."],
    ],
    steps: [
      "Copy the public Pinterest video pin link.",
      "Paste the link into the Pinterest video downloader.",
      "Download the available MP4 source.",
    ],
    faq: [
      ["Can I download a Pinterest video from pin.it?", "Yes, when the short link redirects to a supported public pin."],
      ["Why is a Pinterest video sometimes silent?", "Some Pinterest clips are published without audio. SaveMingo does not invent an audio track that is not present in the source."],
      ["Can I download private Pinterest videos?", "No. Only supported publicly accessible pins are intended to work."],
    ],
    related: pinterestRelated,
  },
  "pinterest-image": {
    platform: "pinterest",
    eyebrow: "Pinterest Image Downloader",
    title: "Pinterest Image Downloader",
    intro:
      "Paste a supported public Pinterest image pin and save the available image source directly to your device.",
    sectionTitle: "Download Pinterest images without extra steps.",
    sectionText:
      "You paste the pin URL rather than hunting for the direct pinimg.com file link.",
    supported: [
      ["Image pins", "Save supported public Pinterest image pins."],
      ["Direct source", "Use the public image source exposed by the pin."],
      ["pin.it links", "Short share links are accepted."],
      ["Optional preview", "Inspect the image only when you choose to."],
    ],
    steps: [
      "Copy the public Pinterest image pin link.",
      "Paste it above.",
      "Press Download to save the available image.",
    ],
    faq: [
      ["Do I need the direct Pinterest image URL?", "No. Paste the public pin URL or supported pin.it link."],
      ["Can SaveMingo download images from secret boards?", "No. Private or secret-board content is outside the supported public-link flow."],
      ["Does the downloader resize the image?", "SaveMingo does not intentionally resize the media source it delivers."],
    ],
    related: pinterestRelated,
  },
  "pinterest-gif": {
    platform: "pinterest",
    eyebrow: "Pinterest GIF Downloader",
    title: "Download animated Pinterest pins",
    intro:
      "Paste a supported public Pinterest pin containing animated media. When Pinterest exposes the animation as video, SaveMingo returns that available source.",
    sectionTitle: "Animated Pinterest media, using the source Pinterest exposes.",
    sectionText:
      "Pinterest can represent animated content as video rather than a traditional GIF file. SaveMingo avoids pretending a format conversion happened.",
    supported: [
      ["Animated pins", "Resolve supported public animated pin media."],
      ["Video-backed GIFs", "Return the available video source when Pinterest serves animation that way."],
      ["No fake conversion", "Keep the actual available media format."],
      ["Public links", "Private pins remain unsupported."],
    ],
    steps: [
      "Copy the public animated Pinterest pin link.",
      "Paste it into SaveMingo.",
      "Download the available animated media source.",
    ],
    faq: [
      ["Will every Pinterest GIF download as .gif?", "No. Pinterest may expose animated content as video. SaveMingo downloads the available source instead of renaming it."],
      ["Can SaveMingo convert MP4 to GIF?", "Not in the current downloader."],
      ["Do pin.it links work?", "Supported pin.it links are resolved to their public Pinterest destination."],
    ],
    related: pinterestRelated,
  },
  "reddit-all": {
    platform: "reddit",
    eyebrow: "Reddit Downloader",
    title: "Download Reddit videos, images and GIFs",
    intro:
      "Paste a supported public Reddit post link to save Reddit-hosted video, image, GIF, or gallery media. No Reddit login or extension is required.",
    sectionTitle: "One Reddit post link for the media Reddit hosts.",
    sectionText:
      "SaveMingo supports public reddit.com posts and common Reddit share links when they resolve to publicly accessible Reddit-hosted media.",
    supported: [
      ["Reddit videos", "Resolve the available Reddit-hosted video track."],
      ["Images", "Save supported i.redd.it and Reddit preview images."],
      ["Galleries", "Return multiple items from supported Reddit gallery posts."],
      ["GIFs", "Handle Reddit-hosted animated media when exposed in post metadata."],
    ],
    steps: [
      "Copy the public Reddit post link.",
      "Paste the link into SaveMingo.",
      "Download the available Reddit-hosted media or open Preview first.",
    ],
    faq: [
      ["Can SaveMingo download Reddit videos with sound?", "Reddit often stores native video and audio as separate streams. The current Reddit adapter downloads the available video track; automatic audio/video merging is not yet enabled, so SaveMingo does not claim sound when it cannot guarantee it."],
      ["Can I download Reddit galleries?", "Supported public gallery posts can return multiple downloadable image or animated items."],
      ["Does it work without a Reddit account?", "Supported public posts do not require your Reddit login credentials."],
      ["Can it download external-site links posted on Reddit?", "The current Reddit adapter focuses on Reddit-hosted media rather than scraping arbitrary external sites."],
    ],
    related: redditRelated,
  },
  "reddit-video": {
    platform: "reddit",
    eyebrow: "Reddit Video Downloader with Sound",
    title: "Reddit Video Downloader with Sound Check",
    intro:
      "Looking for a Reddit video downloader with sound? Paste a supported public Reddit post link. SaveMingo checks whether Reddit reports an audio track before download and clearly shows when no sound is detected.",
    sectionTitle: "Check Reddit video sound before you download.",
    sectionText:
      "Reddit commonly stores native video and audio separately. SaveMingo reads Reddit's audio status and tells you whether sound is detected, absent, or unknown before the download starts.",
    supported: [
      ["Sound check", "See whether Reddit reports audio for the video before you download."],
      ["Reddit video", "Resolve supported v.redd.it video media from public posts."],
      ["No login", "Public Reddit posts work without account credentials."],
      ["Clear warning", "If audio is separate or missing, SaveMingo says so instead of pretending the file includes sound."],
    ],
    steps: [
      "Copy the public Reddit post link containing the video.",
      "Paste it into the Reddit video downloader with sound check.",
      "Review the sound status, then download the available Reddit-hosted video track.",
    ],
    faq: [
      ["Does this Reddit video downloader include sound?", "SaveMingo checks whether Reddit reports an audio track. When Reddit exposes audio separately, the current download can still be video-only, so SaveMingo warns you before and after the download rather than claiming a merged file."],
      ["Why does a Reddit video download with no sound?", "Reddit often stores video and audio as separate DASH streams. A basic MP4 download can therefore contain the video track without the separate audio track."],
      ["What does No sound detected mean?", "It means Reddit's public post metadata reports no audio for that video source."],
      ["Do redd.it share links work?", "Supported share links are normalized when Reddit redirects them to a public post."],
    ],
    related: redditRelated,
  },
  "reddit-image": {
    platform: "reddit",
    eyebrow: "Reddit Image Downloader",
    title: "Download Reddit images and galleries",
    intro:
      "Paste a supported public Reddit post link to save Reddit-hosted images or multiple images from a supported gallery post.",
    sectionTitle: "Save Reddit images from the post, not one-by-one from the feed.",
    sectionText:
      "Gallery results stay together so the shared SaveMingo Download All flow can handle multiple available items.",
    supported: [
      ["Single images", "Save supported Reddit-hosted image posts."],
      ["Galleries", "Return multiple media items from supported Reddit galleries."],
      ["Download all", "Use the shared multi-item result flow."],
      ["Optional preview", "Inspect gallery items only when you want to."],
    ],
    steps: [
      "Copy the public Reddit image or gallery post link.",
      "Paste it into SaveMingo.",
      "Download the image or use Download All for multi-item results.",
    ],
    faq: [
      ["Can SaveMingo download an entire Reddit gallery?", "If Reddit exposes the gallery media in the public post metadata, SaveMingo returns the available gallery items together."],
      ["Can it save images linked from an external website?", "The Reddit adapter currently focuses on Reddit-hosted media."],
      ["Does it require Reddit login?", "No for supported public posts."],
    ],
    related: redditRelated,
  },
  "reddit-gif": {
    platform: "reddit",
    eyebrow: "Reddit GIF Downloader",
    title: "Reddit GIF Downloader",
    intro:
      "Paste a supported public Reddit post containing Reddit-hosted animated media and download the available GIF or video-backed animation source.",
    sectionTitle: "Animated Reddit media without format guesswork.",
    sectionText:
      "Reddit may expose animation through GIF metadata or an MP4-style preview. SaveMingo returns the actual available source.",
    supported: [
      ["GIF posts", "Resolve supported Reddit-hosted animated media."],
      ["MP4-backed animation", "Use the available animated media source when Reddit exposes video."],
      ["Public posts", "No private or quarantined-content bypass."],
      ["No fake conversion", "Keep the real source format."],
    ],
    steps: [
      "Copy the public Reddit post link containing animated media.",
      "Paste it into SaveMingo.",
      "Download the available animation source.",
    ],
    faq: [
      ["Why might a Reddit GIF download as video?", "Some animated media is exposed as MP4-style video rather than a traditional GIF file."],
      ["Can SaveMingo download external GIF hosts?", "The Reddit adapter currently focuses on Reddit-hosted media."],
      ["Does Preview open automatically?", "No. Preview remains optional."],
    ],
    related: redditRelated,
  },

  "tiktok-all": {
    platform: "tiktok",
    eyebrow: "TikTok Downloader",
    title: "Download TikTok videos and photo slideshows",
    intro:
      "Paste a supported public TikTok video, photo post, or short share link. SaveMingo finds the available video or slideshow media without asking for a TikTok login.",
    sectionTitle: "One TikTok link for videos and photo posts.",
    sectionText:
      "Full TikTok post URLs plus supported vm.tiktok.com and vt.tiktok.com share links use the same isolated downloader.",
    supported: [
      ["TikTok videos", "Download supported public TikTok video posts."],
      ["Photo posts", "Save supported TikTok photo and slideshow images."],
      ["Short links", "Resolve supported vm.tiktok.com and vt.tiktok.com share links."],
      ["No login", "Public posts do not require your TikTok password."],
    ],
    steps: [
      "Open the public TikTok post and tap Share, then Copy link.",
      "Paste the TikTok video, photo, vm.tiktok.com, or vt.tiktok.com link into SaveMingo.",
      "Download the available video or use Download All for a photo slideshow.",
    ],
    faq: [
      ["Can SaveMingo download TikTok videos without watermark?", "When TikTok exposes a clean public playback source, SaveMingo uses that available source. SaveMingo does not claim to remove a watermark that is already baked into the file."],
      ["Do vm.tiktok.com and vt.tiktok.com links work?", "Supported TikTok short share links are followed to their public TikTok post before media resolution."],
      ["Can it download TikTok photo slideshows?", "Supported public photo posts can return their available images together for preview and Download All."],
      ["Do I need a TikTok account?", "No for supported publicly accessible posts."],
    ],
    related: tiktokRelated,
  },
  "tiktok-video": {
    platform: "tiktok",
    eyebrow: "TikTok Video Downloader",
    title: "TikTok Video Downloader",
    intro:
      "Paste a supported public TikTok video link and download the best available video source. A clean no-watermark source is used when TikTok exposes one.",
    sectionTitle: "Save public TikTok videos without fake quality claims.",
    sectionText:
      "SaveMingo prefers the strongest public playback source it can resolve and keeps the actual available format instead of re-encoding the video.",
    supported: [
      ["MP4 video", "Download the available public TikTok video source."],
      ["No watermark when available", "Use a clean source when TikTok publicly exposes one."],
      ["Short-link support", "Accept supported vm.tiktok.com and vt.tiktok.com video links."],
      ["Mobile friendly", "Use the same copy, paste, and download flow on phone or desktop."],
    ],
    steps: [
      "Copy the public TikTok video link.",
      "Paste it into the TikTok video downloader.",
      "Press Download and save the available video source.",
    ],
    faq: [
      ["How do I download a TikTok video without watermark?", "Paste the public TikTok link. When TikTok exposes a clean playback source, SaveMingo uses it. If the only available source contains a watermark, SaveMingo does not pretend otherwise."],
      ["Does SaveMingo re-encode TikTok videos?", "No. The current downloader is designed to stream the resolved public source rather than re-encode it."],
      ["Do TikTok short links work?", "Supported vm.tiktok.com and vt.tiktok.com links are resolved to their public destination first."],
      ["Can I download private TikTok videos?", "No. Private or login-only posts are not supported."],
    ],
    related: tiktokRelated,
  },
  "tiktok-photo": {
    platform: "tiktok",
    eyebrow: "TikTok Photo Downloader",
    title: "Download photos from TikTok posts",
    intro:
      "Paste a supported public TikTok photo-post link and save the available images. Multi-image posts stay together so you can preview or download all.",
    sectionTitle: "Save TikTok photo posts without opening every slide.",
    sectionText:
      "SaveMingo reads the public photo-post media list and returns each available image through the same result interface.",
    supported: [
      ["TikTok photos", "Save supported public TikTok image posts."],
      ["Multiple images", "Return several photos from the same supported post."],
      ["Download all", "Use one primary action for multi-image posts."],
      ["Optional preview", "Open Preview only when you want item-level control."],
    ],
    steps: [
      "Copy the public TikTok photo-post link.",
      "Paste the link into SaveMingo.",
      "Download the image or use Download All when multiple photos are available.",
    ],
    faq: [
      ["Can SaveMingo download all photos from a TikTok post?", "When TikTok exposes the public image list, SaveMingo returns the available images together."],
      ["Does this work for normal TikTok videos?", "Use the TikTok Video Downloader for standard video posts; the generic TikTok page auto-detects either type."],
      ["Does Preview open automatically?", "No. Preview remains optional."],
    ],
    related: tiktokRelated,
  },
  "tiktok-slideshow": {
    platform: "tiktok",
    eyebrow: "TikTok Slideshow Downloader",
    title: "TikTok Slideshow Downloader",
    intro:
      "Paste a supported public TikTok slideshow or photo-post link and download the available images individually or together.",
    sectionTitle: "Download the slides from TikTok photo posts.",
    sectionText:
      "TikTok photo posts can contain several images. SaveMingo keeps the slides as individual image files instead of fabricating a slideshow video.",
    supported: [
      ["Every available slide", "Return the public image items TikTok exposes for the post."],
      ["Download all", "Save multiple slideshow images through one result action."],
      ["Original image sources", "Use the available public image URLs rather than screenshots."],
      ["No fake conversion", "Images remain images; SaveMingo does not silently turn them into a video."],
    ],
    steps: [
      "Copy the public TikTok slideshow or photo-post link.",
      "Paste the link into the slideshow downloader.",
      "Use Download All or Preview for individual slides.",
    ],
    faq: [
      ["Can I download every image from a TikTok slideshow?", "For supported public photo posts, SaveMingo returns the available image list together."],
      ["Will the slideshow music be downloaded too?", "Not in the current photo/slideshow downloader. An audio-only TikTok feature needs a separate verified media path."],
      ["Can I make an MP4 slideshow?", "SaveMingo does not currently render slideshow images into a new MP4."],
    ],
    related: tiktokRelated,
  },
};

export function V2PlatformToolPage({ kind }: { kind: V2PlatformPageKind }) {
  const page = configs[kind];

  return (
    <V2SiteShell>
      <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-9 text-center sm:px-6 sm:pb-12 sm:pt-11 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--v2-accent-strong)]">
          {page.eyebrow}
        </p>
        <h1 className="mx-auto mt-3 max-w-4xl text-balance text-4xl font-black leading-[1.03] tracking-[-0.055em] sm:text-5xl">
          {page.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-[15px] leading-6 text-[var(--v2-muted)] sm:text-base">
          {page.intro}
        </p>

        <div className="mt-6 sm:mt-7">
          <V2Downloader platform={page.platform} />
        </div>
      </section>

      <section className="border-y border-[var(--v2-border)] bg-[var(--v2-bg-soft)]/72">
        <div className="mx-auto w-full max-w-6xl px-4 py-11 sm:px-6 sm:py-13 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--v2-accent-strong)]">
                {page.eyebrow}
              </p>
              <h2 className="mt-2 max-w-xl text-3xl font-black tracking-[-0.045em]">
                {page.sectionTitle}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[var(--v2-muted)]">
              {page.sectionText}
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {page.supported.map(([title, text]) => (
              <article
                key={title}
                className="rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--v2-accent-soft)] text-sm font-black text-[var(--v2-accent-strong)]">
                  ✓
                </div>
                <h3 className="mt-4 font-black tracking-[-0.02em]">{title}</h3>
                <p className="mt-1.5 text-sm leading-5 text-[var(--v2-muted)]">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-11 sm:px-6 sm:py-14 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--v2-accent-strong)]">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.045em]">
            Copy. Paste. Download.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-[var(--v2-muted)]">
            Three simple steps from the public post or pin link to the available
            media on your device.
          </p>
        </div>

        <div className="grid gap-3">
          {page.steps.map((step, index) => (
            <article
              key={step}
              className="grid grid-cols-[2.5rem_1fr] gap-4 rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] p-5"
            >
              <span className="font-mono text-xs font-black text-[var(--v2-muted)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-sm font-bold leading-6">{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--v2-border)] bg-[var(--v2-surface)]/55">
        <div className="mx-auto w-full max-w-4xl px-4 py-11 sm:px-6 sm:py-13">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-[var(--v2-accent-strong)]">
              FAQ
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.045em]">
              Common questions.
            </h2>
          </div>

          <div className="mt-7 grid gap-3">
            {page.faq.map(([question, answer]) => (
              <details
                key={question}
                className="rounded-2xl border border-[var(--v2-border)] bg-[var(--v2-surface)] px-5 py-4"
              >
                <summary className="cursor-pointer list-none pr-8 text-sm font-black">
                  {question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-[var(--v2-muted)]">
                  {answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {page.related.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="rounded-full border border-[var(--v2-border)] bg-[var(--v2-surface)] px-4 py-2 text-xs font-black text-[var(--v2-muted)] transition hover:border-[var(--v2-accent)] hover:text-[var(--v2-text)]"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </V2SiteShell>
  );
}
