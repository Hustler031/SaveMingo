export type InstagramSeoPage = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  contentType: string;
  highlights: string[];
  steps: string[];
  faq: Array<[string, string]>;
};

export const instagramSeoPages: Record<string, InstagramSeoPage> = {
  reels: {
    slug: "/instagram-reels-downloader",
    eyebrow: "Instagram Reels",
    title: "Instagram Reels Downloader",
    description:
      "Download supported public Instagram Reels with SaveMingo. Paste a Reel link, resolve the available video, and save it to your device.",
    intro:
      "Paste a supported public Instagram Reel link and SaveMingo will resolve the available video through the same clean downloader used across the site.",
    contentType: "Reels",
    highlights: [
      "Works with supported public Reel links",
      "No Instagram login required",
      "Same-origin media delivery through SaveMingo",
      "Clear request IDs when something fails",
    ],
    steps: [
      "Open the public Reel in Instagram and copy its link.",
      "Paste the link into SaveMingo and choose Get media.",
      "When the Reel resolves, use Download to save the available video.",
    ],
    faq: [
      [
        "Do I need to sign in to Instagram?",
        "No. SaveMingo is designed around publicly accessible Instagram links and does not ask for your Instagram password.",
      ],
      [
        "Can SaveMingo download private Reels?",
        "No. SaveMingo does not bypass private-account controls.",
      ],
      [
        "Why can a Reel occasionally fail?",
        "Instagram can change or temporarily restrict its public responses. SaveMingo returns an error code and request ID so failures can be diagnosed.",
      ],
    ],
  },
  video: {
    slug: "/instagram-video-downloader",
    eyebrow: "Instagram Video",
    title: "Instagram Video Downloader",
    description:
      "Save supported public Instagram video posts with SaveMingo. Paste the post link and download the resolved video without signing in.",
    intro:
      "For supported public Instagram video posts, SaveMingo validates the link, resolves the available video, and provides a direct download through its own media route.",
    contentType: "Video posts",
    highlights: [
      "Public video-post URLs",
      "No account signup",
      "Mobile and desktop friendly",
      "Request-based diagnostics",
    ],
    steps: [
      "Copy the URL of the public Instagram video post.",
      "Paste the URL into the SaveMingo downloader.",
      "Resolve the post and download the available video.",
    ],
    faq: [
      [
        "Is this the same downloader as the Reel tool?",
        "Yes. SaveMingo uses one normalized resolver interface and adapts the result to the type of Instagram link you provide.",
      ],
      [
        "Does SaveMingo permanently store the video?",
        "The current V1 media route streams resolved media without intentionally keeping a permanent copy.",
      ],
      [
        "Are all Instagram video URLs guaranteed to work?",
        "No. Availability depends on the post being public and on Instagram continuing to expose a usable public response.",
      ],
    ],
  },
  photo: {
    slug: "/instagram-photo-downloader",
    eyebrow: "Instagram Photos",
    title: "Instagram Photo Downloader",
    description:
      "Download supported public Instagram photos with SaveMingo using the same simple copy, paste, and save workflow.",
    intro:
      "SaveMingo includes a normalized photo path for supported public Instagram posts so image results can use the same interface as Reels, videos, and carousels.",
    contentType: "Photos",
    highlights: [
      "Public photo-post handling",
      "One shared Instagram input",
      "No credential collection",
      "Consistent media result cards",
    ],
    steps: [
      "Copy the link of the public Instagram photo post.",
      "Paste it into SaveMingo and resolve the post.",
      "Use the Photo result card to download the available image.",
    ],
    faq: [
      [
        "Can I use this for a private profile?",
        "No. SaveMingo is limited to publicly accessible links and does not bypass private-account permissions.",
      ],
      [
        "Does SaveMingo change the image?",
        "SaveMingo aims to deliver the media URL that its resolver can obtain. It does not intentionally apply filters or edits.",
      ],
      [
        "Why does the site show a request ID?",
        "The request ID lets us trace the exact resolver or media-delivery failure without asking you for technical logs.",
      ],
    ],
  },
  carousel: {
    slug: "/instagram-carousel-downloader",
    eyebrow: "Instagram Carousels",
    title: "Instagram Carousel Downloader",
    description:
      "Download supported public Instagram carousel posts with SaveMingo and get each resolved photo or video as a separate media item.",
    intro:
      "When a supported public carousel resolves, SaveMingo separates the available photos and videos into individual result cards so each item can be downloaded independently.",
    contentType: "Carousels",
    highlights: [
      "Multiple media items from one post",
      "Mixed photo/video result support",
      "Individual download buttons",
      "Live-verified carousel resolver path",
    ],
    steps: [
      "Copy the public Instagram carousel link.",
      "Paste the single post URL into SaveMingo.",
      "Download each resolved photo or video from its own result card.",
    ],
    faq: [
      [
        "Do I need to paste every carousel item separately?",
        "No. Use the public carousel post URL once. SaveMingo returns the media items it can resolve from that post.",
      ],
      [
        "Can a carousel contain both photos and videos?",
        "Yes. SaveMingo's normalized media model can return both image and video items in one result.",
      ],
      [
        "What if only some items are available?",
        "Upstream availability can vary. SaveMingo only presents media that the resolver can obtain from the public response.",
      ],
    ],
  },
};

export function faqJsonLd(page: InstagramSeoPage) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}
