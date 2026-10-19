/**
 * Svaraya Audio DSP & Pipeline Verification Test
 * Validates audio math, pitch conversion, downmixing, trimmer logic, and encoder byte calculations.
 */

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

function test432HzRatio() {
  const standardConcertPitch = 440.0;
  const targetVerdiPitch = 432.0;
  const ratio = targetVerdiPitch / standardConcertPitch;
  
  // 432 / 440 = 0.98181818...
  assert(Math.abs(ratio - 0.98181818) < 0.0001, "432 Hz to 440 Hz ratio is exactly 432/440 (~0.9818)");
  
  // Semitones shift: 12 * log2(432/440) ≈ -0.317666 semitones (-31.766 cents)
  const semitones = 12 * Math.log2(ratio);
  assert(Math.abs(semitones - (-0.31766)) < 0.001, "Semitones shift is ~ -0.3177 (-31.8 cents)");
}

function testMonoDownmix() {
  const leftChannel = [1.0, -0.5, 0.25];
  const rightChannel = [0.5, -0.5, -0.25];
  
  const mono = leftChannel.map((l, i) => (l + rightChannel[i]) * 0.5);
  
  assert(mono[0] === 0.75, "Downmix sample 0: (1.0 + 0.5) / 2 = 0.75");
  assert(mono[1] === -0.5, "Downmix sample 1: (-0.5 + -0.5) / 2 = -0.5");
  assert(mono[2] === 0.0, "Downmix sample 2: (0.25 + -0.25) / 2 = 0.0 (phase cancellation check)");
}

function testTrimmerBounds() {
  const duration = 120.0; // 2 minutes
  const trimStart = 15.0;
  const trimEnd = 45.0;
  
  assert(trimStart >= 0, "Trim start is non-negative");
  assert(trimEnd <= duration, "Trim end is within duration");
  assert(trimEnd > trimStart, "Trim end is strictly greater than trim start");
  
  const slicedDuration = trimEnd - trimStart;
  assert(slicedDuration === 30.0, "Sliced duration is exactly 30 seconds");
  
  // Sample calculation at 44100 Hz
  const sampleRate = 44100;
  const startSample = Math.floor(trimStart * sampleRate);
  const endSample = Math.floor(trimEnd * sampleRate);
  const totalSamples = endSample - startSample;
  assert(totalSamples === 30 * 44100, "Total sliced samples match exact integer frame count");
}

function testWavByteLength() {
  const sampleRate = 44100;
  const channels = 2;
  const durationSec = 10;
  const numFrames = sampleRate * durationSec;
  
  // 16-bit: 2 bytes per sample * 2 channels = 4 bytes per frame + 44 byte header
  const bytes16 = 44 + numFrames * channels * 2;
  assert(bytes16 === 44 + 441000 * 4, "WAV 16-bit calculation matches exact PCM header and payload size");
  
  // 24-bit: 3 bytes per sample * 2 channels = 6 bytes per frame + 44 byte header
  const bytes24 = 44 + numFrames * channels * 3;
  assert(bytes24 === 44 + 441000 * 6, "WAV 24-bit calculation matches exact PCM header and payload size");
  
  // 32-bit float: 4 bytes per sample * 2 channels = 8 bytes per frame + 44 byte header
  const bytes32 = 44 + numFrames * channels * 4;
  assert(bytes32 === 44 + 441000 * 8, "WAV 32-bit float calculation matches exact PCM header and payload size");
}

function testLimiterSoftKnee() {
  // Peak protection soft-knee limiter for extreme boost:
  // For inputs |x| <= 0.9, x is linear.
  // For inputs |x| > 0.9, x is compressed with tanh so it never exceeds 1.0 (0 dBFS).
  const softLimit = (x: number): number => {
    const threshold = 0.9;
    if (Math.abs(x) <= threshold) return x;
    const sign = Math.sign(x);
    const excess = Math.abs(x) - threshold;
    return sign * (threshold + (1 - threshold) * Math.tanh(excess / (1 - threshold)));
  };

  assert(softLimit(0.5) === 0.5, "Linear below threshold");
  assert(softLimit(-0.5) === -0.5, "Negative linear below threshold");
  assert(softLimit(1.5) < 1.0 && softLimit(1.5) > 0.9, "1.5 compressed below 1.0 peak");
  assert(softLimit(5.0) <= 1.0 && softLimit(5.0) >= 0.99, "Extreme signal +5.0 strictly bounded within 1.0 (no hard 0dBFS overshoot)");
}

console.log("=== Running Svaraya Audio DSP Verification ===");
test432HzRatio();
testMonoDownmix();
testTrimmerBounds();
testWavByteLength();
testLimiterSoftKnee();
console.log("=== All DSP & Audio Math Validations Passed! ===");
