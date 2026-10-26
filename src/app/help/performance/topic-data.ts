/**
 * Content source for the /help/performance page.
 *
 * Kept as plain structured data so tests can verify page content, anchor
 * targets, and that every claim matches real product behavior:
 *  - Studio upload limit: 10 MB (src/lib/audio-file.ts, siteConfig.maxFileSizeBytes)
 *  - Tool upload limit: 50 MB default (src/components/tools/tool-uploader.tsx)
 *  - Supported input formats: MP3, WAV, OGG, FLAC, AAC / M4A (tools also accept AIFF)
 *  - Render output is capped at 10 minutes (src/lib/audio/dsp-plan.ts MAX_OUTPUT_SECONDS)
 *  - Audio never leaves the device (100% in-browser Web Audio processing)
 *  - Android app exists in the repository as a Capacitor WebView loading the
 *    deployed site (capacitor.config.ts, applicationId in.nyxen.audify)
 */

export type HelpTopic = {
  /** Anchor id used by the jump-link list on the page. */
  id: string;
  /** Visible section heading. */
  title: string;
  /** One-sentence summary shown in the symptom picker / TOC. */
  blurb: string;
  /** Ordered practical steps (rendered as a checklist). */
  steps: string[];
  /** Optional context paragraphs rendered after the steps. */
  notes?: string[];
};

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: "slow-processing",
    title: "Audio processing is slow",
    blurb: "Long files, layered effects, and limited CPU resources all add render time.",
    steps: [
      "Close resource-heavy applications and browser tabs you are not using — live video calls, cloud sync and other playing music compete for the same CPU.",
      "Try a shorter audio file first. Render time grows roughly with the file's duration and size.",
      "Avoid running several demanding tools at the same time in different tabs.",
      "Keep the Audify page open and visible while processing. Minimising the tab can pause or slow the render.",
      "If your device grows unusually hot, let it cool down before retrying.",
      "Restart your browser and reload the site if performance stays poor.",
    ],
    notes: [
      "Slow rendering is normal, not a fault. Audify renders audio entirely inside your browser with your own device's CPU — a long file with several active effects, such as 8D movement or deep reverb, takes proportionally longer on any device. We can't promise every device processes every file quickly.",
      "Exports are capped at 10 minutes of output audio. If your settings would exceed that, the render stops with a clear message — shorten the clip or use a less extreme slowdown.",
    ],
  },
  {
    id: "freezes-crashes",
    title: "Browser freezes, crashes, or runs out of memory",
    blurb: "Decoded audio buffers can use a lot of RAM, especially with long files.",
    steps: [
      "Retry with a smaller or shorter file — memory use scales with audio length.",
      "Close other tabs and applications before loading a large file.",
      "Restart your browser to release memory left behind by earlier sessions.",
      "Keep enough free memory on your device (close apps you don't need; if other apps slow down, free device storage).",
      "Use a current, supported browser such as recent versions of Chrome, Safari, Firefox or Edge.",
    ],
    notes: [
      "Because processing happens locally, your browser holds decoded audio entirely in memory — it adds up to hundreds of megabytes for long files. If a tab is killed by your browser, simply reload and start again — your settings don't persist, so note your preferred settings before heavy edits.",
    ],
  },
  {
    id: "upload-fails",
    title: "Upload fails or my file is rejected",
    blurb: "Size and format limits are enforced the moment a file is dropped.",
    steps: [
      "Check the file size: the Studio accepts files up to 10 MB; individual Tools accept up to 50 MB per file.",
      "Check the format: MP3, WAV, OGG (Vorbis or Opus), FLAC and AAC / M4A are supported (Tools additionally accept AIFF). Files must be standard audio containers with valid headers.",
      "If the file was downloaded from streaming apps like Apple Music, it may be DRM-protected (e.g. .m4p) — re-encode it to a standard MP3 or WAV first.",
      "Check the file still plays in another player. A damaged or truncated file can't be decoded.",
      "Verify the file extension matches what it really is — a renamed extension doesn't change the data inside.",
      "Tap and hold, drop again, or reload the page if the upload was interrupted mid-decode.",
    ],
    notes: [
      "Nothing is uploaded anywhere — the file is read and decoded directly in your tab, so an interruption is harmless. Files larger than the limit are rejected before decoding, and DRM-protected files fail immediately.",
    ],
  },
  {
    id: "playback-issues",
    title: "Playback stutters, is silent, or output sounds wrong",
    blurb: "Volume, output device, browser audio restrictions — or effect settings.",
    steps: [
      "Check your device volume, in-page volume slider, and that the page isn't muted from a browser tab strip.",
      "Check which audio output device your browser is using (headphones, speakers or HDMI) — switch it back if needed.",
      "Use the playback controls; when a browser restricts autoplay, start playback manually with the play button.",
      "Pause other audio applications that may be competing for output.",
      "After processing, press play on the result again — regenerating the render can fix a stale buffer.",
      "Try the exported file in another player with a compatible decoder to confirm.",
      "Distortion or clipping can come from processing settings, not just the source. Lower excessive effect intensity — for example reverb amount, bass level or output gain — and re-render.",
    ],
    notes: [
      "Audify seeks the audio element volume, so dragging the in-page volume slider changes playback loudness only — it does not alter the exported file's mix.",
    ],
  },
  {
    id: "export-fails",
    title: "Download or export failed",
    blurb: "First figure out whether processing or downloading is the failing part.",
    steps: [
      "Check free device storage — large WAV exports need room to save.",
      "Check that your browser is allowed to download files (some browsers have per-site or work-profile download restrictions).",
      "Keep the tab open while processing and downloading, and wait for the checkmark telling you the save started.",
      "Retry the export; every render is independent, so retrying does not disturb your current settings.",
      "Check your device's Downloads folder — the file may have saved under its suggested name.",
      "Try a supported browser if downloads repeatedly fail.",
    ],
    notes: [
      "Processing failure and download failure are different: if you never received the checkmark after clicking a download button, the failure occurred while downloading (storage or browser permissions). If the render itself stops with an error or progress bar freezing before a result appears, it's a processing failure — start with the \"Processing is slow\" and \"Freezes\" sections above.",
      "On the Android app, tapping a download button opens your system save / share sheet so you can pick a destination.",
    ],
  },
  {
    id: "mobile-slow-hot",
    title: "My mobile device gets slow or hot",
    blurb: "Phones and tablets have tighter memory and thermal limits than laptops.",
    steps: [
      "Close background apps before processing.",
      "Use shorter files — mobile browsers also enforce their own per-tab memory ceilings, which is why the Studio keeps a 10 MB file limit.",
      "Avoid switching apps mid-render, as browsers can freeze hidden tabs.",
      "Keep your device adequately charged; throttling can affect performance.",
      "Let the device cool if it becomes warm to the touch.",
      "Update your browser (or the installed Audify Android app) to the latest version.",
    ],
    notes: [
      "A native Android app ships in this repository as a WebView wrapper around the deployed site, so the same in-browser engine applies on Android too. Everything still renders locally on your phone's CPU.",
    ],
  },
  {
    id: "slow-loading-ads",
    title: "Website or resources load slowly",
    blurb: "Tell apart slow page loads, slow audio processing, and unfilled ads.",
    steps: [
      "Slow initial page load: check your connection strength, reload once, or try another network.",
      "Audio processing taking time is expected and local — it doesn't depend on your connection after the page loads.",
      "A failed network request usually shows as an error banner instead of slow loading — reload the page to retry.",
      "If an ad space stays empty, the provider simply had no ad to serve at that moment. An unfilled ad does not mean the audio tool is broken.",
      "We don't claim every slow ad is a browser problem — ad delivery depends on Adsterra's network and your region.",
    ],
    notes: [
      "The audio engine loads with the page and runs offline of the ad network — ads fill asynchronously and never block processing.",
    ],
  },
  {
    id: "privacy-local",
    title: "Privacy and local processing",
    blurb: "What stays on your device — and what doesn't.",
    steps: [
      "Your audio never leaves your device. Files are decoded, processed and rendered entirely inside your browser tab with the Web Audio API.",
      "Audify has no server-side audio upload or processing pipeline — there is nothing to breach because nothing is stored.",
      "Standard network requests still occur to load the page itself: site assets and fonts, plus advertisements served by Adsterra.",
      "The contact form sends exactly what you type (name, email, message) to our email provider — it never includes audio.",
    ],
    notes: [],
  },
];
