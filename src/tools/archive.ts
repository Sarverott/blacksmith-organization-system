// bos archive <tool>: work at rest (glossary: archive, repos-mirrors)
import { tool } from "../core/tool.ts";
import { archiveText } from "../views/archiving.ts";

export const archiveTools = [
  tool({
    model: "archive",
    name: "mirror",
    info: "a read-only clone of the forge → a bare mirror in archive/.repos-mirrors/ (Q6); --confirm removes the forge copy when nothing would be lost",
    readOnly: false,
    args: [
      {
        name: "path",
        type: "string",
        info: "the project in the forge: forge/<scope>/<project>",
        positional: true,
        required: true,
      },
      { name: "confirm", type: "boolean", info: "remove the forge copy too (the owner's OK)" },
      { name: "dryRun", type: "boolean", info: "only say what would be done" },
    ],
    run: (bos, input) =>
      bos.archiveMirror(String(input.path), {
        confirm: Boolean(input.confirm),
        dryRun: Boolean(input.dryRun),
      }),
    render: archiveText,
  }),
];
