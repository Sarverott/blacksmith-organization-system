// bos version <tool>: the version arithmetic of the craft loop, for scripts and CI
import { tool } from "../core/tool.ts";
import { bumpGrih, bumpSemver, EVENTS, isLoopEvent } from "../core/version.ts";

export const versionTools = [
  tool({
    model: "version",
    name: "bump",
    info: "the next version after a loop event; semver X.Y.Z, or GRIH G.R.I.H with --grih",
    args: [
      { name: "version", type: "string", info: "current version, e.g. 0.6.1", positional: true, required: true },
      { name: "event", type: "string", info: EVENTS.join(", "), positional: true, required: true },
      { name: "grih", type: "boolean", info: "read and write GRIH instead of semver" },
    ],
    run: (_bos, input) => {
      const event = String(input.event);
      if (!isLoopEvent(event)) throw new Error(`"${event}" is not a loop event (${EVENTS.join(", ")})`);
      return (input.grih ? bumpGrih : bumpSemver)(String(input.version), event);
    },
    render: (result) => result,
  }),
];
