// The craft loop as data (glossary: craft-loop). A project may replace any field in the
// "loop" section of its .github/bos.json; every field is checked by Loop before use.

export type LoopData = {
  // every branch of the loop
  stations: string[];
  // where a station may go; the first is its forward step, the others its ways back
  directions: Record<string, string[]>;
  // contributors' own branches ("dev/*") and the station they are merged into
  contributors: { pattern: string; into: string };
  // open the pull request of the forward step by itself
  autocreate: boolean;
  // per station: whether the pull request of its forward step merges by itself once checked;
  // a contributor's branch never does
  automerge: Record<string, boolean>;
  // the station where a release is made
  release: string;
};

// from gitrecon's .github/bos.config.json, except that releasing → master waits for the
// owner (the Canon Keeper of the legacy concept) (decision Q10, changelog phase 2)
export const DEFAULT_LOOP: LoopData = {
  stations: ["master", "development", "revision", "testing", "releasing", "rejection"],
  directions: {
    master: ["development"],
    development: ["revision", "rejection"],
    revision: ["testing", "rejection"],
    testing: ["releasing", "rejection"],
    releasing: ["master", "rejection"],
    rejection: ["development"],
  },
  contributors: { pattern: "dev/*", into: "development" },
  autocreate: true,
  automerge: {
    master: false,
    development: true,
    revision: true,
    testing: true,
    releasing: false,
    rejection: false,
  },
  release: "master",
};
