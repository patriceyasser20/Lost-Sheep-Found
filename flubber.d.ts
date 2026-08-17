declare module 'flubber' {
  export interface FlubberOptions {
    maxSegmentLength?: number;
    string?: boolean;
    single?: boolean;
  }

  export function interpolate(
    fromShape: string,
    toShape: string,
    options?: FlubberOptions
  ): (t: number) => string;

  export function interpolateAll(
    fromShapes: string[],
    toShapes: string[],
    options?: FlubberOptions
  ): (t: number) => string[];

  export function toCircle(
    fromShape: string,
    cx: number,
    cy: number,
    r: number,
    options?: FlubberOptions
  ): (t: number) => string;

  export function toRect(
    fromShape: string,
    x: number,
    y: number,
    width: number,
    height: number,
    options?: FlubberOptions
  ): (t: number) => string;

  export function separate(
    fromShape: string,
    toShapes: string[],
    options?: FlubberOptions
  ): (t: number) => string;

  export function combine(
    fromShapes: string[],
    toShape: string,
    options?: FlubberOptions
  ): (t: number) => string;
}