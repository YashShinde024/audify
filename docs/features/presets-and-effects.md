# Presets & Effects

Audify includes **62 built-in audio modules**: **43 Creative Acoustic Presets** and **19 Audio Utilities**, organized into **9 acoustic categories**.

Every preset is declared in [`src/config/presets.ts`](../../src/config/presets.ts) and mapped to genuine DSP pipelines in [`src/lib/audio/dsp-plan.ts`](../../src/lib/audio/dsp-plan.ts).

---

## 1. Acoustic Category Taxonomy

1. **Slowed & Reverb (`slowed-reverb`):**
   - Varispeed speed reductions coupled with lush convolution hall decays.
   - Presets: *Slowed + Reverb*, *Slowed (0.85×)*, *Super Slowed (0.75×)*, *Vaporwave*, *Cathedral Reverb*, *Church Hall Reverb*, *Vocal Plate*, *Slapback Echo*, *Echo Chamber*.
2. **Speed & Pitch (`speed-pitch`):**
   - Varispeed lifts and mathematical pitch transpositions.
   - Presets: *Sped Up (1.15×)*, *Nightcore (1.25× pitch + speed)*, *Daycore (0.80×)*, *432 Hz Sacred Harmonic Tuning*, *Pitch Shifter*, *Tempo Changer*.
3. **Spatial Audio (`spatial-audio`):**
   - Psychoacoustic spatial fields and orbital soundscapes.
   - Presets: *8D Audio (Sinusoidal orbital panning)*, *Auto-Panner*, *Stereo Panner*, *Stereo Widening (Haas effect)*, *Haas Spatializer*, *Ping-Pong Delay*, *Chorus Flanger*.
4. **Bass & Tone (`bass-tone`):**
   - Calibrated low-end tiers with dynamic headroom protection.
   - Presets: *Bass Boost Light (+3.5 dB)*, *Bass Boost Moderate (+7.0 dB)*, *Bass Boost Heavy (+10.5 dB)*, *Bass Boost Extreme (+15.0 dB)*, *3-Band Equalizer*, *Treble Air*, *Mid Scoop*, *Sub-Rumble Cut*.
5. **Vocal & Speech (`vocal-speech`):**
   - Dynamic vocal treatment and broadcast leveling.
   - Presets: *Vocal Air*, *Vocal Clarity*, *De-Harsh*, *Podcast Voice*, *Gentle Compression*, *Vocal Leveling*, *Vocal Remover (Mid/Side Center Attenuation)*.
6. **Ambient & Creative (`ambient-creative`):**
   - Analog emulation and retro decimation.
   - Presets: *Lo-Fi Tape (Wow & Flutter + 4kHz shelf)*, *Tape Warmth*, *Tube Warmth*, *AM Radio*, *Underwater (400Hz lowpass)*, *Muffled Room*, *Telephone Voice*, *Reverse Audio*, *Bitcrusher (4-16 bit downsampling)*.
7. **Clean & Restore (`clean-restore`):**
   - Acoustic cleaning and sample DC restoration.
   - Presets: *Noise Reducer (80Hz rumble cut)*, *DC Offset Remover (5Hz highpass)*, *Audio Normalizer (Peak to −0.3 dBFS)*.
8. **Utilities (`utilities`):**
   - Core production utilities.
   - Presets: *Volume Changer*, *Audio Trimmer & Cutter*, *Fade In & Out*, *Mono Downmixer*, *BPM Detector*, *Audio Splitter*, *Audio Merger*.
9. **Export & Conversion (`export-conversion`):**
   - Bitstream and sample clock transcoding.
   - Presets: *Format Converter*, *Sample Rate Converter (22.05–48 kHz)*, *Mastering Polish*.

---

## 2. Essential Standard Presets (Top 9)

Audify highlights 9 iconic acoustic signatures:
- `slowed-reverb` (Slowed + Reverb)
- `nightcore` (Nightcore)
- `daycore` (Daycore)
- `8d-audio` (8D Audio)
- `bass-boost-heavy` (Bass Boost)
- `pitch-432hz` (432 Hz Sacred Pitch)
- `lofi-tape` (Lo-Fi Tape)
- `cathedral-reverb` (Cathedral Reverb)
- `underwater` (Underwater)

---

## 3. Parameter Schema Definition

Each preset declares its tunable parameters using the `PresetParam` schema:

```typescript
export interface PresetParam {
  id: string;               // Unique parameter key within the preset
  label: string;            // Human-readable title
  kind: "slider" | "toggle" | "select";
  min?: number;             // Minimum slider bound
  max?: number;             // Maximum slider bound
  step?: number;            // Step increment
  unit?: string;            // Unit (%, dB, Hz, s, ms, semitones)
  options?: { label: string; value: string | number }[];
  description: string;      // Acoustic behavior explanation
}
```

---

## 4. Custom User Presets

Users can fine-tune any preset's sliders and save their custom curve as a **Custom Preset**:
- Saved to `localStorage` under `audify-custom-presets-v1`.
- Schema: `{ id: string, name: string, basePresetId: string, values: Record<string, any>, createdAt: number }`.
- Exportable to standalone `.json` files or importable via file upload.
