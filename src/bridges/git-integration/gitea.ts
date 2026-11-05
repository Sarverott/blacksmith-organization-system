// extends remote-git
// Gitea (gitea.com): a mirror of the source (.github/bos.json "mirrors"); a self-hosted Gitea keeps
// scope repositories private (__WORKSHOP/AGENTS.md). Only its place in the hierarchy so far.
import { RemoteGit } from "./remote-git.ts";

export class Gitea extends RemoteGit {
  static override readonly domain: string = "gitea.com";
}
