// extends git-base
// can be mirror of source or main public repo
// A place the repository is pushed to, seen from a clone (cwd): the source (github.com for
// this one) or a mirror the source is propagated to (.github/bos.json "mirrors").
import type { Host } from "../../core/host.ts";
import { Git } from "./git-base.ts";

export type RemoteRole = "source" | "mirror";

export class RemoteGit extends Git {
  // the public host of this kind, e.g. "gitea.com" (a self-hosted one has its own)
  static readonly domain: string = "";
  readonly role: RemoteRole;

  constructor(host: Host, cwd: string, role: RemoteRole = "source") {
    super(host, cwd);
    this.role = role;
  }
}
