import Link from "next/link";
import type { ReactNode } from "react";

export type FaqCategory =
  | "all"
  | "getting-started"
  | "audio-processing"
  | "presets-effects"
  | "formats-exports"
  | "privacy-files"
  | "troubleshooting";

export interface FaqItem {
  id: string;
  category: Exclude<FaqCategory, "all">;
  categoryLabel: string;
  question: string;
  answerText: string;
  answerNode: ReactNode;
}

export const FAQ_DATA: FaqItem[] = [
  // 1. Getting started
  {
    id: "faq-what-is-audify",
    category: "getting-started",
    categoryLabel: "Getting started",
    question: "What is Audify and how does it process audio?",
    answerText:
      "Audify is an in-browser audio workstation and preset laboratory designed for fast, high-fidelity sound manipulation. Unlike cloud converters that upload your audio to third-party servers, Audify processes everything directly on your device using the HTML5 Web Audio API and WebAssembly.",
    answerNode: (
      <p>
        Audify is an in-browser audio workstation and preset laboratory designed for fast, high-fidelity sound manipulation. Unlike cloud converters that upload your audio to third-party servers, Audify processes everything directly on your device using the HTML5 Web Audio API and WebAssembly. You can test effects live in the{" "}
        <Link href="/studio" className="font-medium text-violet hover:underline">
          Audify Studio
        </Link>{" "}
        or read our pipeline overview in the{" "}
        <Link href="/how-it-works" className="font-medium text-violet hover:underline">
          Audio Guide
        </Link>
        .
      </p>
    ),
  },
  {
    id: "faq-no-install",
    category: "getting-started",
    categoryLabel: "Getting started",
    question: "Do I need to install any software or create an account?",
    answerText:
      "No. Audify requires no downloads, plugins, or account registration. It runs instantly in all modern desktop and mobile browsers, including Chrome, Safari, Firefox, and Edge. Your settings and audio buffers exist only in your current browser session.",
    answerNode: (
      <p>
        No. Audify requires no downloads, plugins, or account registration. It runs instantly in all modern desktop and mobile browsers, including Chrome, Safari, Firefox, and Edge. Your settings and audio buffers exist only in your current browser session.
      </p>
    ),
  },
  {
    id: "faq-mobile-support",
    category: "getting-started",
    categoryLabel: "Getting started",
    question: "Can I use Audify on a smartphone or tablet?",
    answerText:
      "Yes. Audify is fully responsive and touch-friendly on iOS and Android. Because mobile browsers enforce strict memory ceilings on individual browser tabs, we maintain a 10 MB file limit to prevent tab crashes and keep playback smooth.",
    answerNode: (
      <p>
        Yes. Audify is fully responsive and touch-friendly on iOS and Android. Because mobile browsers enforce strict memory ceilings on individual browser tabs, we maintain a 10 MB file limit to prevent tab crashes and keep playback smooth.
      </p>
    ),
  },

  // 2. Audio processing
  {
    id: "faq-audio-quality",
    category: "audio-processing",
    categoryLabel: "Audio processing",
    question: "Does processing in the browser degrade audio quality?",
    answerText:
      "No. When you import audio, Audify decodes it into 32-bit floating-point linear PCM buffers. All digital signal processing—including biquad filters, convolution reverb, and stereo spatialization—operates with full 32-bit float headroom (+770 dB before digital clipping). Audio is only compressed or quantized if you choose a lossy export format like MP3.",
    answerNode: (
      <p>
        No. When you import audio, Audify decodes it into 32-bit floating-point linear PCM buffers. All digital signal processing—including biquad filters, convolution reverb, and stereo spatialization—operates with full 32-bit float headroom (+770 dB before digital clipping). Audio is only compressed or quantized if you choose a lossy export format like MP3.
      </p>
    ),
  },
  {
    id: "faq-varispeed-vs-pitch",
    category: "audio-processing",
    categoryLabel: "Audio processing",
    question: "What is the difference between Varispeed and independent pitch shifting?",
    answerText:
      "In standard Varispeed mode (used by Slowed + Reverb or Nightcore), playback rate and pitch are physically linked—slowing playback drops pitch, while speeding up raises pitch, exactly like analog tape or vinyl. When pitch must change independently from tempo, Audify employs polyphase sinc resampling to shift semitones while preserving timeline duration.",
    answerNode: (
      <p>
        In standard Varispeed mode (used by <em>Slowed + Reverb</em> or <em>Nightcore</em>), playback rate and pitch are physically linked—slowing playback drops pitch, while speeding up raises pitch, exactly like analog tape or vinyl. When pitch must change independently from tempo, Audify employs polyphase sinc resampling to shift semitones while preserving timeline duration. See detailed calculations in our{" "}
        <Link href="/how-it-works#speed-and-pitch" className="font-medium text-violet hover:underline">
          Audio Guide
        </Link>
        .
      </p>
    ),
  },
  {
    id: "faq-why-local-dsp",
    category: "audio-processing",
    categoryLabel: "Audio processing",
    question: "Why does Audify compute audio locally instead of in the cloud?",
    answerText:
      "Local DSP provides zero upload delay, instantaneous waveform scrub feedback, absolute confidentiality, and offline capability. Your audio never queues on a server or consumes bandwidth.",
    answerNode: (
      <p>
        Local DSP provides zero upload delay, instantaneous waveform scrub feedback, absolute confidentiality, and offline capability. Your audio never queues on a server or consumes bandwidth.
      </p>
    ),
  },

  // 3. Presets and effects
  {
    id: "faq-presets-under-hood",
    category: "presets-effects",
    categoryLabel: "Presets & effects",
    question: "How do Audify presets work under the hood?",
    answerText:
      "Presets are modular DSP routing chains assembled from real Web Audio nodes: multi-pole IIR biquad filters, synthetic convolution reverb impulse responses, LFO-modulated stereo panners, and waveshaper saturators.",
    answerNode: (
      <p>
        Presets are modular DSP routing chains assembled from real Web Audio nodes: multi-pole IIR biquad filters, synthetic convolution reverb impulse responses, LFO-modulated stereo panners, and waveshaper saturators. You can inspect and hear each preset in the{" "}
        <Link href="/presets" className="font-medium text-violet hover:underline">
          Presets Catalog
        </Link>{" "}
        or customize parameter sliders in{" "}
        <Link href="/studio" className="font-medium text-violet hover:underline">
          Audify Studio
        </Link>
        .
      </p>
    ),
  },
  {
    id: "faq-modify-presets",
    category: "presets-effects",
    categoryLabel: "Presets & effects",
    question: "Can I customize preset parameters after applying them?",
    answerText:
      "Yes. Every preset provides full parameter transparency. In Studio, you can adjust playback speed, pitch semitones, reverb wet/dry blend, decay time, three-band EQ bands (low, mid, high), and stereo widening.",
    answerNode: (
      <p>
        Yes. Every preset provides full parameter transparency. In Studio, you can adjust playback speed, pitch semitones, reverb wet/dry blend, decay time, three-band EQ bands (low, mid, high), and stereo widening.
      </p>
    ),
  },
  {
    id: "faq-8d-headphones",
    category: "presets-effects",
    categoryLabel: "Presets & effects",
    question: "Why are headphones required for 8D Audio and spatial presets?",
    answerText:
      "8D Audio and binaural spatial presets rely on dynamic interaural time difference (ITD) and interaural level difference (ILD) stereo panning between your left and right ears. Standard laptop or phone speakers mix sound waves in the open air (acoustic crosstalk), eliminating the 360-degree rotational illusion. Stereo headphones or in-ear monitors are required.",
    answerNode: (
      <p>
        8D Audio and binaural spatial presets rely on dynamic interaural time difference (ITD) and interaural level difference (ILD) stereo panning between your left and right ears. Standard laptop or phone speakers mix sound waves in the open air (acoustic crosstalk), eliminating the 360-degree rotational illusion. Stereo headphones or in-ear monitors are required.
      </p>
    ),
  },

  // 4. Formats and exports
  {
    id: "faq-supported-formats",
    category: "formats-exports",
    categoryLabel: "Formats & exports",
    question: "Which audio formats and containers can I import?",
    answerText:
      "Audify supports standard browser-decodable audio containers and codecs: MP3, WAV, OGG (Vorbis and Opus), FLAC, and AAC / M4A. Audio files must have valid container headers and stay within our 10 MB and 10-minute duration ceiling.",
    answerNode: (
      <p>
        Audify supports standard browser-decodable audio containers and codecs: <strong>MP3, WAV, OGG (Vorbis and Opus), FLAC, and AAC / M4A</strong>. Audio files must have valid container headers and stay within our 10 MB and 10-minute duration ceiling.
      </p>
    ),
  },
  {
    id: "faq-export-profiles",
    category: "formats-exports",
    categoryLabel: "Formats & exports",
    question: "What export formats and quality profiles are available?",
    answerText:
      "You can export uncompressed 16-bit, 24-bit, or 32-bit float WAV (at 44.1 kHz or 48.0 kHz) for lossless preservation, or encode to MP3 using our client-side LAME encoder at selectable bitrates up to 320 kbps CBR.",
    answerNode: (
      <p>
        You can export uncompressed <strong>16-bit, 24-bit, or 32-bit float WAV</strong> (at 44.1 kHz or 48.0 kHz) for lossless preservation, or encode to <strong>MP3</strong> using our client-side LAME encoder at selectable bitrates up to <strong>320 kbps CBR</strong>. Learn more about export settings in the{" "}
        <Link href="/how-it-works#export-formats" className="font-medium text-violet hover:underline">
          Audio Guide
        </Link>
        .
      </p>
    ),
  },
  {
    id: "faq-lookahead-limiter",
    category: "formats-exports",
    categoryLabel: "Formats & exports",
    question: "How does the export limiter prevent clipping and distortion?",
    answerText:
      "Every rendered master output passes through a look-ahead true-peak limiter calibrated to −0.3 dBFS. This ceiling provides inter-sample headroom, preventing digital overs and harsh clipping distortion even when heavy low-shelf EQ boosts or resonant filters add substantial gain.",
    answerNode: (
      <p>
        Every rendered master output passes through a look-ahead true-peak limiter calibrated to <strong>−0.3 dBFS</strong>. This ceiling provides inter-sample headroom, preventing digital overs and harsh clipping distortion even when heavy low-shelf EQ boosts or resonant filters add substantial gain.
      </p>
    ),
  },

  // 5. Privacy and files
  {
    id: "faq-privacy-guarantee",
    category: "privacy-files",
    categoryLabel: "Privacy & files",
    question: "Do my audio files or waveforms ever leave my computer?",
    answerText:
      "Never. Audify adheres to a zero-telemetry architecture. All decoding, waveform rendering, DSP calculation, and export encoding occur in volatile browser memory on your device. No audio chunks or files are ever uploaded or transmitted across the network.",
    answerNode: (
      <p>
        Never. Audify adheres to a zero-telemetry architecture. All decoding, waveform rendering, DSP calculation, and export encoding occur in volatile browser memory on your device. No audio chunks or files are ever uploaded or transmitted across the network. Review our full{" "}
        <Link href="/privacy" className="font-medium text-violet hover:underline">
          Privacy Policy
        </Link>{" "}
        for details.
      </p>
    ),
  },
  {
    id: "faq-file-limit-rationale",
    category: "privacy-files",
    categoryLabel: "Privacy & files",
    question: "Why is there a 10 MB and 10-minute file size limit?",
    answerText:
      "Because browser-based audio requires decoding compressed audio into raw 32-bit float PCM buffers (where 5 minutes of stereo audio consumes ~50 MB of raw memory, and multi-pass convolution impulse processing requires working buffers), the 10 MB ceiling guarantees stable performance across all consumer laptops and smartphones without tab memory exhaustion.",
    answerNode: (
      <p>
        Because browser-based audio requires decoding compressed audio into raw 32-bit float PCM buffers (where 5 minutes of stereo audio consumes ~50 MB of raw memory, and multi-pass convolution impulse processing requires working buffers), the 10 MB ceiling guarantees stable performance across all consumer laptops and smartphones without tab memory exhaustion.
      </p>
    ),
  },
  {
    id: "faq-tab-cleanup",
    category: "privacy-files",
    categoryLabel: "Privacy & files",
    question: "What happens to my audio data when I close or refresh the tab?",
    answerText:
      "Audio buffers exist strictly in temporary browser heap memory. As soon as you navigate away, reload, or close the browser tab, the browser runtime immediately garbage-collects all audio buffers. No audio is cached to disk, LocalStorage, or cookies.",
    answerNode: (
      <p>
        Audio buffers exist strictly in temporary browser heap memory. As soon as you navigate away, reload, or close the browser tab, the browser runtime immediately garbage-collects all audio buffers. No audio is cached to disk, LocalStorage, or cookies. For details on platform usage terms, consult our{" "}
        <Link href="/terms" className="font-medium text-violet hover:underline">
          Terms of Service
        </Link>
        .
      </p>
    ),
  },

  // 6. Troubleshooting
  {
    id: "faq-decode-error",
    category: "troubleshooting",
    categoryLabel: "Troubleshooting",
    question: "Why did my audio file fail to import or decode?",
    answerText:
      "Common reasons include DRM protection (such as Apple Music .m4p or protected streaming downloads), corrupt file headers, unsupported proprietary codecs, or files exceeding the 10 MB limit. Try re-encoding your source file to standard 16-bit 44.1 kHz WAV or standard MP3 using an audio utility, then import it again.",
    answerNode: (
      <p>
        Common reasons include DRM protection (such as Apple Music <code>.m4p</code> or protected streaming downloads), corrupt file headers, unsupported proprietary codecs, or files exceeding the 10 MB limit. Try re-encoding your source file to standard 16-bit 44.1 kHz WAV or standard MP3 using an audio utility, then import it again. If issues persist, send a diagnostic report via our{" "}
        <Link href="/contact" className="font-medium text-violet hover:underline">
          Contact Form
        </Link>
        .
      </p>
    ),
  },
  {
    id: "faq-stutter-dropouts",
    category: "troubleshooting",
    categoryLabel: "Troubleshooting",
    question: "Why is playback stuttering or dropping audio samples?",
    answerText:
      "Complex preset graphs (e.g., high-order biquad filters combined with long convolution reverbs and active spatial panning) can saturate single-core CPU threads in older devices. Close background tabs consuming CPU resources, or render the file directly via the Export panel—offline export renders mathematically at full precision without stutter.",
    answerNode: (
      <p>
        Complex preset graphs (e.g., high-order biquad filters combined with long convolution reverbs and active spatial panning) can saturate single-core CPU threads in older devices. Close background tabs consuming CPU resources, or render the file directly via the Export panel—offline export renders mathematically at full precision without stutter.
      </p>
    ),
  },
  {
    id: "faq-screen-lock-pause",
    category: "troubleshooting",
    categoryLabel: "Troubleshooting",
    question: "Why does audio pause when my mobile screen turns off?",
    answerText:
      "Mobile operating systems (iOS Safari and Android Chrome) intentionally suspend Web Audio clock timers when the screen locks or when switching to background apps to save battery power. Keep your browser active and your screen awake while listening to previews or rendering exports.",
    answerNode: (
      <p>
        Mobile operating systems (iOS Safari and Android Chrome) intentionally suspend Web Audio clock timers when the screen locks or when switching to background apps to save battery power. Keep your browser active and your screen awake while listening to previews or rendering exports.
      </p>
    ),
  },
];
