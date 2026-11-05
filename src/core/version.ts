// The two version schemes of BOS (docs/devlog/ROADMAP.md):
//   a project:  semver vX.Y.Z
//   a scope:    GRIH   vG.R.I.H
// and the four events of the craft loop that bump them.
//
// | event     | semver | GRIH |
// | step      | Z      | H    |
// | phase     | Y      | I    |
// | milestone | X      | R    |
// | flip      | X      | G    |   the script flips: pre-alpha → alpha, a key concept changes

export const EVENTS = ["step", "phase", "milestone", "flip"] as const;
export type LoopEvent = (typeof EVENTS)[number];

export function isLoopEvent(value: string): value is LoopEvent {
  return (EVENTS as readonly string[]).includes(value);
}

function parse(version: string, count: number, scheme: string): number[] {
  const parts = version.replace(/^v/, "").split(".");
  const numbers = parts.map(Number);
  if (parts.length !== count || numbers.some((n) => !Number.isInteger(n) || n < 0)) {
    throw new Error(
      `"${version}" is not a ${scheme} version (${count} whole numbers joined by dots)`,
    );
  }
  return numbers;
}

// raise the digit at index, zero every digit after it
function raise(numbers: number[], index: number): string {
  return numbers.map((n, i) => (i < index ? n : i === index ? n + 1 : 0)).join(".");
}

const SEMVER_DIGIT: Record<LoopEvent, number> = { flip: 0, milestone: 0, phase: 1, step: 2 };
const GRIH_DIGIT: Record<LoopEvent, number> = { flip: 0, milestone: 1, phase: 2, step: 3 };

// "0.6.1" + phase → "0.7.0"; pre-release or build suffixes are not part of the core's scheme
export function bumpSemver(version: string, event: LoopEvent): string {
  return raise(parse(version, 3, "semver"), SEMVER_DIGIT[event]);
}

// "0.1.2.3" + milestone → "0.2.0.0"
export function bumpGrih(version: string, event: LoopEvent): string {
  return raise(parse(version, 4, "GRIH"), GRIH_DIGIT[event]);
}

// <0, 0, >0 like a sort comparator: "1.10.0" is after "1.9.3"
export function compareSemver(a: string, b: string): number {
  const [x, y] = [parse(a, 3, "semver"), parse(b, 3, "semver")];
  for (let i = 0; i < 3; i++) {
    if (x[i] !== y[i]) {
      return (x[i] ?? 0) - (y[i] ?? 0);
    }
  }
  return 0;
}

export const GRIH_START = "0.0.0.0";
