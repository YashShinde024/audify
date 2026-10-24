# Audio Encoders & Export

Audify implements high-performance, client-side binary audio encoders in [`src/lib/audio/encoders.ts`](file:///c:/Users/Yash%20Shinde/OneDrive/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/Projects/Audify/src/lib/audio/encoders.ts). All output files are generated directly into browser memory blobs without backend transcoding.

---

## 1. Supported Formats & Encoders

| Format | Type | Bit Depths / Bitrates | Implementation | Use Cases |
| :--- | :--- | :--- | :--- | :--- |
| **WAV** | Lossless PCM | 16-bit Int, 24-bit Int, 32-bit Float | Custom RIFF binary writer | Studio mastering, archival, CD standard |
| **AIFF** | Lossless PCM | 16-bit Int, 24-bit Int, 32-bit Float | Custom FORM/AIFF binary writer (Big-Endian) | Broadcast, Apple ecosystem |
| **MP3** | Compressed MPEG | 128, 192, 320 kbps CBR | Bundled `lamejs` v1.2.1 | Web streaming, social sharing, portable players |

---

## 2. Lossless WAV Encoder Details

The custom WAV encoder writes canonical RIFF chunk structures directly into an `ArrayBuffer`:
- **`RIFF` Header:** Declares overall file size.
- **`fmt ` Subchunk:** Specifies format code (`1` for integer PCM, `3` for IEEE 754 float), channel count, sample rate, byte rate, block align, and bits per sample.
- **`data` Subchunk:** Contains sequential interleaved channel samples.

### Bit Depth Precision
- **16-bit Integer:** Clamps float samples to $[-1.0, +1.0]$ and quantizes to 16-bit two's complement integers ($[-32768, 32767]$).
- **24-bit Integer:** Studio master quality ($[-8388608, 8388607]$), offering $144\text{ dB}$ of dynamic range.
- **32-bit Float:** IEEE 754 single-precision floating point. Preserves true mathematical values without clipping or quantization noise.

---

## 3. MP3 Encoder Details

MP3 encoding is handled via bundled `lamejs`:
- Encodes interleaved 16-bit PCM samples into an MPEG Audio Layer III bitstream.
- **Constant Bitrate (CBR):**
  - **320 kbps:** Maximum quality, transparent reproduction.
  - **192 kbps:** High quality, balanced file size.
  - **128 kbps:** Compact file size for quick messaging or low-bandwidth web distribution.

---

## 4. Export Configuration Interface

The Studio export panel (`src/components/editor/export-panel.tsx`) allows users to select:
1. **Container Format:** `WAV`, `AIFF`, or `MP3`.
2. **Bit Depth:** `16`, `24`, or `32` bits (for WAV/AIFF).
3. **MP3 Bitrate:** `128`, `192`, or `320` kbps (for MP3).
4. **Sample Rate:** Matches the native source buffer (e.g. 44.1 kHz or 48.0 kHz).

Downloads are triggered through temporary Blob Object URLs (`URL.createObjectURL(blob)`), which are safely revoked after delivery to prevent browser memory leaks.
