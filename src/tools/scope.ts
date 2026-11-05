// bos scope <tool>
import { tool } from "../core/tool.ts";
import { EVENTS, isLoopEvent } from "../core/version.ts";

const scopeArg = {
  name: "scope",
  type: "string",
  info: "scope name in the forge",
  positional: true,
  required: true,
} as const;

export const scopeTools = [
  tool({
    model: "scope",
    name: "version",
    info: "the scope's GRIH version (vG.R.I.H), from <scope>/.bos/scope.json",
    args: [scopeArg],
    run: (bos, input) => {
      const scope = bos.workshop.forge.scope(String(input.scope));
      if (!scope.exists()) throw new Error(`no scope at ${scope.path}`);
      return { scope: scope.name, version: scope.version() };
    },
    render: (result) => `${result.scope}  ${result.version ? `v${result.version}` : "no version yet"}`,
  }),
  tool({
    model: "scope",
    name: "bump",
    info: `raise the scope's GRIH version for a loop event: ${EVENTS.join(", ")}`,
    readOnly: false,
    args: [
      scopeArg,
      {
        name: "event",
        type: "string",
        info: "step → H, phase → I, milestone → R, flip → G",
        positional: true,
        required: true,
      },
      { name: "dryRun", type: "boolean", info: "only show the new version" },
    ],
    run: async (bos, input) => {
      const event = String(input.event);
      if (!isLoopEvent(event)) throw new Error(`"${event}" is not a loop event (${EVENTS.join(", ")})`);
      const context = await bos.bumpScope(String(input.scope), event, { dryRun: Boolean(input.dryRun) });
      return { ...context.result, dryRun: context.dryRun };
    },
    render: (result) =>
      `${result.scope}  ${result.from ? `v${result.from}` : "(none)"} → v${result.to}${result.dryRun ? "  (dry run)" : ""}`,
  }),
];
