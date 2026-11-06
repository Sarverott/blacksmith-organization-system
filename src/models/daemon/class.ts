// The daemons of a workshop (glossary: daemon): their services, files and state.
import {
  type DaemonFiles,
  type DaemonState,
  daemonFiles,
  type Service,
} from "../../core/daemon.ts";
import type { Host } from "../../core/host.ts";
import { packagePath } from "../../core/paths.ts";

// the services every workshop has (resources/daemons/<name>.json)
export const PACKAGE_DAEMONS = packagePath("resources", "daemons");

export class Daemons {
  readonly host: Host;
  readonly root: string;

  constructor(host: Host, workshopRoot: string) {
    this.host = host;
    this.root = workshopRoot;
  }

  // the workshop's own services, which win over the package's
  get setupPath(): string {
    return `${this.root}/.BOS/setup/daemons`;
  }

  files(name: string): DaemonFiles {
    return daemonFiles(this.root, name);
  }

  names(): string[] {
    const found = [this.setupPath, PACKAGE_DAEMONS].flatMap((dir) =>
      this.host
        .list(dir)
        .filter((entry) => !entry.directory && entry.name.endsWith(".json"))
        .map((entry) => entry.name.replace(/\.json$/, "")),
    );
    return [...new Set(found)].sort();
  }

  // the service and where it was read from; null when no file names it
  service(name: string): { service: Service; from: string } | null {
    for (const dir of [this.setupPath, PACKAGE_DAEMONS]) {
      const from = `${dir}/${name}.json`;
      const text = this.host.readText(from);
      if (text !== null) {
        return { service: { ...(JSON.parse(text) as Service), name }, from };
      }
    }
    return null;
  }

  state(name: string): DaemonState | null {
    const text = this.host.readText(this.files(name).state);
    return text === null ? null : (JSON.parse(text) as DaemonState);
  }

  // its supervisor lives (the state may be left over from one that died)
  alive(state: DaemonState | null): boolean {
    return Boolean(state && state.status !== "stopped" && this.host.signal(state.supervisor, 0));
  }
}
