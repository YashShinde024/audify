import { describe, expect, it } from "vitest";

import { encodeAiff, encodeMp3, encodeWav } from "../../audio-engine";

/** Minimal AudioBuffer stand-in — the encoders only read these four members. */
function fakeBuffer(channels: Float32Array[], sampleRate = 44100): AudioBuffer {
  return {
    numberOfChannels: channels.length,
    sampleRate,
    length: channels[0].length,
    duration: channels[0].length / sampleRate,
    getChannelData: (c: number) => channels[Math.min(c, channels.length - 1)],
    copyFromChannel: () => undefined,
    copyToChannel: () => undefined,
  } as unknown as AudioBuffer;
}

const ascii = (view: DataView, offset: number, length: number) => {
  let out = "";
  for (let i = 0; i < length; i++) out += String.fromCharCode(view.getUint8(offset + i));
  return out;
};

async function bytes(blob: Blob): Promise<DataView> {
  return new DataView(await blob.arrayBuffer());
}

describe("encodeWav", () => {
  const left = new Float32Array([0, 0.5, -1, 0.25]);
  const right = new Float32Array([0.1, -0.5, 1, -0.75]);
  const buffer = fakeBuffer([left, right]);

  it("writes a correct 16-bit stereo header", async () => {
    const blob = encodeWav(buffer, 16);
    expect(blob.type).toBe("audio/wav");
    const view = await bytes(blob);
    expect(ascii(view, 0, 4)).toBe("RIFF");
    expect(view.getUint32(4, true)).toBe(52); // RIFF size field = total file size − 8
    expect(ascii(view, 8, 4)).toBe("WAVE");
    expect(ascii(view, 12, 4)).toBe("fmt ");
    expect(view.getUint32(16, true)).toBe(16); // fmt chunk size
    expect(view.getUint16(20, true)).toBe(1); // PCM
    expect(view.getUint16(22, true)).toBe(2); // stereo
    expect(view.getUint32(24, true)).toBe(44100);
    expect(view.getUint32(28, true)).toBe(44100 * 2 * 2); // byte rate
    expect(view.getUint16(32, true)).toBe(2 * 2); // block align
    expect(view.getUint16(34, true)).toBe(16); // bit depth
    expect(ascii(view, 36, 4)).toBe("data");
    // Interleaved, little-endian; full scale maps to −2^(depth−1), so 0.5 → 0.5×32767 = 16383.
    expect(view.getUint16(44 + 2 * 2, true)).toBe(0x3fff); // frame 1 left
    expect(view.getUint16(44 + 4 * 2, true)).toBe(0x8000); // frame 2 left, −1
  });

  it("switches to IEEE float format at 32 bits", async () => {
    const view = await bytes(encodeWav(buffer, 32));
    expect(view.getUint16(20, true)).toBe(3); // IEEE float tag
    expect(view.getUint16(34, true)).toBe(32);
    expect(view.getUint32(28, true)).toBe(44100 * 2 * 4);
    view.getFloat32(44, true); // frame 0 left
    expect(view.getFloat32(44, true)).toBe(0);
    expect(view.getFloat32(44 + 4, true)).toBeCloseTo(0.1, 7); // frame 0 right
    expect(view.getFloat32(44 + 8, true)).toBe(0.5); // frame 1 left
  });

  it("encodes 24-bit PCM with the right sizes and negative clipping", async () => {
    const blob = encodeWav(buffer, 24);
    const view = await bytes(blob);
    expect(view.getUint16(20, true)).toBe(1);
    expect(view.getUint16(34, true)).toBe(24);
    expect(view.getUint32(28, true)).toBe(44100 * 2 * 3);
    expect(view.getUint32(40, true)).toBe(4 * 2 * 3);
    expect(blob.size).toBe(44 + 4 * 2 * 3);
    // frame 2 left −1 → the encoder maps full scale to −2^23 (0xC00000),
    // so little-endian bytes 53–55 are 0x00 0x00 0xC0.
    expect(view.getUint8(53)).toBe(0x00);
    expect(view.getUint8(54)).toBe(0x00);
    expect(view.getUint8(55)).toBe(0xc0);
  });

  it("handles mono and a non-44.1 kHz rate", async () => {
    const mono = new Float32Array([0.5, -0.5]);
    const view = await bytes(encodeWav(fakeBuffer([mono], 48000), 16));
    expect(view.getUint16(22, true)).toBe(1);
    expect(view.getUint32(24, true)).toBe(48000);
    expect(view.getUint32(40, true)).toBe(2 * 2);
  });
});

describe("encodeAiff", () => {
  const left = new Float32Array([0, 0.5, -0.5]);
  const right = new Float32Array([0.5, 0.25, -0.75]);
  const buffer = fakeBuffer([left, right], 48000);

  it("writes FORM/AIFF with a COMM chunk carrying channels, frames, depth and rate", async () => {
    const blob = encodeAiff(buffer, 16);
    expect(blob.type.toLowerCase()).toContain("aiff");
    const view = await bytes(blob);
    expect(ascii(view, 0, 4)).toBe("FORM");
    expect(ascii(view, 8, 4)).toBe("AIFF");
    expect(ascii(view, 12, 4)).toBe("COMM");
    expect(view.getUint32(16, false)).toBe(18); // COMM payload size
    expect(view.getInt16(20, false)).toBe(2); // channels
    expect(view.getUint32(22, false)).toBe(3); // frames
    expect(view.getInt16(26, false)).toBe(16); // bit depth
    // Rate lives in the 80-bit float at 28..37; exponent must match log2(48000).
    const biased = (view.getUint8(28) << 8) | view.getUint8(29);
    expect(biased - 16383).toBe(Math.floor(Math.log2(48000)));
    // SSND starts right after COMM: 12 + (8 + 18).
    expect(ascii(view, 38, 4)).toBe("SSND");
    expect(view.getUint32(42, false)).toBe(8 + 3 * 2 * 2); // chunk size incl. its own offset/block
    expect(view.getUint32(46, false)).toBe(0); // data offset
    expect(view.getUint32(50, false)).toBe(0); // block size
  });

  it("encodes big-endian payload starting after the SSND header", async () => {
    const blob = encodeAiff(buffer, 16);
    const view = await bytes(blob);
    // Frame 0 right (0.5) → 0.5 × 32767 = 16383 (0x3FFF) BE at 56.
    expect(view.getUint16(54, false)).toBe(0x0000); // frame 0 left
    expect(view.getUint16(56, false)).toBe(0x3fff); // frame 0 right
    expect(view.getUint16(58, false)).toBe(0x3fff); // frame 1 left
    const payload = 3 * 2 * 2;
    const ssndData = 8 + payload + (payload % 2);
    expect(blob.size).toBe(8 + 4 + (8 + 18) + (8 + ssndData));
  });

  it("24-bit AIFF samples are big-endian and clip below −1 only to the floor", async () => {
    const view = await bytes(encodeAiff(fakeBuffer([new Float32Array([-0.5])]), 24));
    const base = 12 + 8 + 18 + 8 + 8; // after SSND's offset/blockSize
    expect(
      (view.getUint8(base) << 16) | (view.getUint8(base + 1) << 8) | view.getUint8(base + 2)
    ).toBe(0xc00000); // −0.5 → −8388608/2
  });

  it("96 kHz survives the 80-bit float rate field exactly", async () => {
    const hi = fakeBuffer([new Float32Array(4)], 96000);
    const view = await bytes(encodeAiff(hi, 16));
    const biased = (view.getUint8(28) << 8) | view.getUint8(29);
    const unbiased = biased - 16383;
    expect(unbiased).toBe(Math.floor(Math.log2(96000))); // 16
    // Mantissa: 8 bytes (explicit 1 + 63 fraction bits), big-endian.
    let mant = BigInt(0);
    for (let i = 0; i < 8; i++) {
      mant = (mant << BigInt(8)) | BigInt(view.getUint8(30 + i));
    }
    expect(mant >> BigInt(63)).toBe(BigInt(1)); // explicit integer bit set
    expect(mant).toBe(BigInt(96000) << BigInt(63 - unbiased));
  });
});

describe("encodeMp3", () => {
  it("produces an MPEG frame stream at a supported rate", async () => {
    const buffer = fakeBuffer([new Float32Array(44100)], 44100);
    const blob = encodeMp3(buffer, 192);
    expect(blob.type).toBe("audio/mp3");
    const view = await bytes(blob);
    expect(blob.size).toBeGreaterThan(0);
    // MP3 frames start with an all-1s sync word (0xFF0xE0 pattern).
    const syncFound = view.getUint8(0) === 0xff && (view.getUint8(1) & 0xe0) === 0xe0;
    expect(syncFound).toBe(true);
  });

  it("mono buffers encode without a right channel", async () => {
    const blob = encodeMp3(fakeBuffer([new Float32Array(44100)]), 320);
    expect(blob.size).toBeGreaterThan(0);
  });

  it("rejects rates outside the 32/44.1/48 kHz MP3 floor instead of encoding junk", () => {
    for (const rate of [22050, 11025, 8000, 96000]) {
      const buffer = fakeBuffer([new Float32Array(4)], rate);
      expect(() => encodeMp3(buffer, 320)).toThrow(/32 kHz, 44\.1 kHz and 48 kHz only/);
    }
  });
});
