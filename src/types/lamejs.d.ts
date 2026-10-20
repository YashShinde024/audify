declare module "lamejs" {
  export class Mp3Encoder {
    constructor(channels: number, samplerate: number, kbps: number);
    encodeBuffer(left: Int16Array, right?: Int16Array): Int8Array;
    flush(): Int8Array;
  }

  export class WavHeader {
    static readHeader(dataView: DataView): {
      channels: number;
      sampleRate: number;
      bitDepth: number;
      dataOffset: number;
      dataLen: number;
    };
  }
}

declare module "lamejs/src/js/MPEGMode.js" {
  const MPEGMode: unknown;
  export default MPEGMode;
}
declare module "lamejs/src/js/Lame.js" {
  const Lame: unknown;
  export default Lame;
}
declare module "lamejs/src/js/BitStream.js" {
  const BitStream: unknown;
  export default BitStream;
}

