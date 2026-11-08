import { basename } from "../../core/paths.ts";
import { workshopName } from "../../models/index.ts";
import type { BootstrapContext } from "./context.ts";

// a workshop is built only where it belongs: in a directory named __WORKSHOP (or
// $WORKSHOP_RENAME), and not while areas of a workshop lie beside it (a second one, half
// made: bos workshop repair first). So a mistake is stopped before it spreads.
export function guard({ host, workshop }: BootstrapContext): void {
  const name = workshopName(host);
  if (basename(workshop.path) !== name) {
    throw new Error(
      `${workshop.path} is not named ${name}: a workshop is built only in such a directory`,
    );
  }
  const misplaced = workshop.misplacedAreas();
  if (misplaced.length) {
    throw new Error(
      `areas of a workshop lie beside it (${misplaced.join(", ")}): bos workshop repair first`,
    );
  }
}
