/**
 * Audify Audio Analysis & Feature Extraction
 * Extracts BPM / Tempo from decoded PCM audio buffers using autocorrelation.
 */

/**
 * Autocorrelation BPM detection algorithm from decoded PCM samples.
 */
export function detectAudioBpm(buffer: AudioBuffer): number {
  try {
    const channelData = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;

    // Downsample to ~2205 Hz for fast tempo analysis
    const downsampleFactor = Math.max(1, Math.floor(sampleRate / 2205));
    const maxSamples = Math.min(channelData.length, Math.floor(sampleRate * 45)); // analyze up to first 45 sec
    const downsampledLength = Math.floor(maxSamples / downsampleFactor);
    const downsampled = new Float32Array(downsampledLength);

    for (let i = 0; i < downsampledLength; i++) {
      downsampled[i] = channelData[i * downsampleFactor];
    }

    // Energy envelope extraction
    const envelope = new Float32Array(downsampledLength);
    let env = 0;
    for (let i = 0; i < downsampledLength; i++) {
      const s = Math.abs(downsampled[i]);
      env = Math.max(s, env * 0.985);
      envelope[i] = env;
    }

    // Autocorrelation over lag corresponding to 65 to 185 BPM
    const effectiveSampleRate = sampleRate / downsampleFactor;
    const minLag = Math.floor((effectiveSampleRate * 60) / 185);
    const maxLag = Math.floor((effectiveSampleRate * 60) / 65);

    let bestLag = minLag;
    let maxCorr = -1;

    for (let lag = minLag; lag <= maxLag; lag += 2) {
      let sum = 0;
      const len = Math.min(downsampledLength - lag, 3500);
      for (let i = 0; i < len; i += 4) {
        sum += envelope[i] * envelope[i + lag];
      }
      if (sum > maxCorr) {
        maxCorr = sum;
        bestLag = lag;
      }
    }

    const detected = Math.round((effectiveSampleRate * 60) / bestLag);
    return Math.min(190, Math.max(65, detected));
  } catch (err) {
    console.warn("BPM detection fallback:", err);
    return 120;
  }
}
