/**
 * Generates an in-memory synthetic audio sample for instant studio demonstration.
 * Creates a warm 6-second harmonic chord progression (Cmaj7 - Am7 - Fmaj7 - G7)
 * encoded as a standard 16-bit 44.1 kHz stereo PCM WAV file.
 */
export function generateStudioSampleAudioFile(): File {
  const sampleRate = 44100;
  const duration = 6.0;
  const totalSamples = Math.floor(sampleRate * duration);
  const numChannels = 2;

  // Chord progression: [chord frequencies in Hz, start time, end time]
  // Cmaj7 (C4, E4, G4, B4), Am7 (A3, C4, E4, G4), Fmaj7 (F3, A3, C4, E4), G7 (G3, B3, D4, F4)
  const chords = [
    { notes: [261.63, 329.63, 392.0, 493.88], start: 0.0, end: 1.5 },
    { notes: [220.0, 261.63, 329.63, 392.0], start: 1.5, end: 3.0 },
    { notes: [174.61, 220.0, 261.63, 329.63], start: 3.0, end: 4.5 },
    { notes: [196.0, 246.94, 293.66, 349.23], start: 4.5, end: 6.0 },
  ];

  const leftChannel = new Float32Array(totalSamples);
  const rightChannel = new Float32Array(totalSamples);

  for (const chord of chords) {
    const startSample = Math.floor(chord.start * sampleRate);
    const endSample = Math.min(totalSamples, Math.floor(chord.end * sampleRate));
    const chordDuration = chord.end - chord.start;

    for (let i = startSample; i < endSample; i++) {
      const t = (i - startSample) / sampleRate;
      // Exponential decay envelope with soft attack
      const attack = Math.min(1, t / 0.04);
      const decay = Math.exp(-t * (1.2 / chordDuration));
      const env = attack * decay;

      let sampleL = 0;
      let sampleR = 0;

      chord.notes.forEach((freq, noteIdx) => {
        // Fundamental + soft 2nd harmonic overtone
        const osc1 = Math.sin(2 * Math.PI * freq * t);
        const osc2 = Math.sin(4 * Math.PI * freq * t) * 0.35;
        const noteSig = (osc1 + osc2) * 0.16;

        // Subtle stereo panning per chord note
        const pan = (noteIdx / (chord.notes.length - 1)) * 0.5 + 0.25; // 0.25 to 0.75
        sampleL += noteSig * (1 - pan);
        sampleR += noteSig * pan;
      });

      leftChannel[i] += sampleL * env;
      rightChannel[i] += sampleR * env;
    }
  }

  // 16-bit PCM WAV File Header (44 bytes)
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = totalSamples * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // BitsPerSample
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  // Interleave and quantize to 16-bit signed PCM
  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    const l = Math.max(-1, Math.min(1, leftChannel[i]));
    const r = Math.max(-1, Math.min(1, rightChannel[i]));
    view.setInt16(offset, l < 0 ? l * 0x8000 : l * 0x7fff, true);
    view.setInt16(offset + 2, r < 0 ? r * 0x8000 : r * 0x7fff, true);
    offset += 4;
  }

  const blob = new Blob([buffer], { type: "audio/wav" });
  return new File([blob], "audify-studio-sample.wav", { type: "audio/wav" });
}
