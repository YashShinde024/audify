/**
 * Audify Natural Language Sound Request Matcher
 * Maps freeform user phrases directly into supported presets and DSP values.
 */

export function interpretSoundPrompt(prompt: string): { presetId: string; matchedLabel: string } | null {
  const p = prompt.toLowerCase().trim();
  if (!p) return null;

  // 432 Hz
  if (p.includes("432") || p.includes("432hz")) {
    return { presetId: "pitch-432hz", matchedLabel: "432 Hz Tuning Conversion" };
  }

  // Bass Boost levels
  if (p.includes("extreme bass") || p.includes("earrape") || p.includes("bass boosted heavy")) {
    return { presetId: "bass-boost-extreme", matchedLabel: "Extreme Bass Booster (+15dB)" };
  }
  if (p.includes("heavy bass") || p.includes("hard bass")) {
    return { presetId: "bass-boost-heavy", matchedLabel: "Heavy Bass Booster (+10dB)" };
  }
  if (p.includes("bass") || p.includes("boost") || p.includes("808")) {
    return { presetId: "bass-boost-mod", matchedLabel: "Moderate Bass Booster (+7dB)" };
  }

  // Infrasonic Rumble Cut / Cleanup
  if (p.includes("sub rumble") || p.includes("infrasonic") || p.includes("30hz") || p.includes("dc offset")) {
    return { presetId: "sub-rumble-cut", matchedLabel: "30 Hz Infrasonic Rumble Cut" };
  }

  // Reverbs
  if (p.includes("bathroom") || p.includes("shower") || p.includes("tile")) {
    return { presetId: "bathroom-reverb", matchedLabel: "Bathroom Reverb" };
  }
  if (p.includes("church") || p.includes("sanctuary")) {
    return { presetId: "church-hall-reverb", matchedLabel: "Church Hall Reverb" };
  }
  if (p.includes("cathedral") || p.includes("massive reverb")) {
    return { presetId: "cathedral-reverb", matchedLabel: "Cathedral Reverb" };
  }
  if (p.includes("vocal reverb") || p.includes("voice reverb")) {
    return { presetId: "vocal-reverb", matchedLabel: "Vocal Reverb" };
  }
  if (p.includes("plate") || p.includes("plate reverb")) {
    return { presetId: "plate-reverb", matchedLabel: "Studio Plate Reverb" };
  }

  // Stereo & Panning
  if (p.includes("auto pan") || p.includes("panner") || p.includes("left to right")) {
    return { presetId: "auto-panner", matchedLabel: "Auto Panner" };
  }
  if (p.includes("8d") || p.includes("rotate") || p.includes("spinning") || p.includes("3d")) {
    return { presetId: "8d-audio", matchedLabel: "8D Audio" };
  }
  if (p.includes("haas") || p.includes("precedence")) {
    return { presetId: "haas-spatializer", matchedLabel: "Haas Stereo Spatializer" };
  }

  // Utilities
  if (p.includes("fade") || p.includes("fade in") || p.includes("fade out")) {
    return { presetId: "fade-in-out", matchedLabel: "Audio Fade In & Out" };
  }
  if (p.includes("volume") || p.includes("louder") || p.includes("quieter") || p.includes("gain")) {
    return { presetId: "volume-changer", matchedLabel: "Volume & Gain Changer" };
  }
  if (p.includes("equalizer") || p.includes("eq")) {
    return { presetId: "equalizer", matchedLabel: "3-Band Equalizer" };
  }
  if (p.includes("trim") || p.includes("cut") || p.includes("crop")) {
    return { presetId: "trimmer-cutter", matchedLabel: "Audio Trimmer & Cutter" };
  }
  if (p.includes("mono") || p.includes("downmix")) {
    return { presetId: "downmixer", matchedLabel: "Stereo to Mono Downmixer" };
  }
  if (p.includes("bpm") || p.includes("tempo detect")) {
    return { presetId: "bpm-detector", matchedLabel: "BPM & Tempo Detector" };
  }

  // Vocal enhancements
  if (p.includes("vocal air") || p.includes("vocal presence") || p.includes("sparkle voice")) {
    return { presetId: "vocal-air", matchedLabel: "Vocal Air & Presence" };
  }

  // Tape / Tube / Lo-Fi Warmth
  if (p.includes("tube") || p.includes("preamp") || p.includes("tube warmth")) {
    return { presetId: "tube-warmth", matchedLabel: "Vintage Tube Warmth" };
  }
  if (p.includes("tape warmth") || p.includes("analog warmth") || p.includes("warm tape")) {
    return { presetId: "tape-warmth", matchedLabel: "Warm Analog Tape" };
  }

  // Creative & Radios
  if (p.includes("radio") || p.includes("am radio") || p.includes("walkie talkie") || p.includes("broadcast")) {
    return { presetId: "am-radio", matchedLabel: "Vintage AM Radio" };
  }
  if (p.includes("room next door") || p.includes("party next door") || p.includes("muffled")) {
    return { presetId: "muffled-room", matchedLabel: "Room Next Door (Muffled)" };
  }

  // Speed & Viral
  if (p.includes("slow") && (p.includes("reverb") || p.includes("space") || p.includes("chill"))) {
    return { presetId: "slowed-reverb", matchedLabel: "Slowed + Reverb" };
  }
  if (p.includes("super slow") || p.includes("ultra slow")) {
    return { presetId: "super-slowed", matchedLabel: "Super Slowed" };
  }
  if (p.includes("slow") || p.includes("relax") || p.includes("downtempo")) {
    return { presetId: "slowed", matchedLabel: "Slowed" };
  }
  if (p.includes("nightcore") || p.includes("speed up") || p.includes("sped up")) {
    return { presetId: "nightcore", matchedLabel: "Nightcore" };
  }
  if (p.includes("daycore") || p.includes("deep voice")) {
    return { presetId: "daycore", matchedLabel: "Daycore" };
  }
  if (p.includes("reverse") || p.includes("backwards")) {
    return { presetId: "reverse", matchedLabel: "Reverse Audio" };
  }
  if (p.includes("underwater") || p.includes("submerged")) {
    return { presetId: "underwater", matchedLabel: "Underwater Submersion" };
  }

  return null;
}
