declare module 'gifuct-js' {
  export interface ParsedFrame {
    dims: { width: number; height: number; top: number; left: number };
    patch: Uint8ClampedArray;
    disposalType: number;
  }
  export function parseGIF(buf: ArrayBuffer): unknown;
  export function decompressFrames(gif: unknown, buildPatch: boolean): ParsedFrame[];
}
