// extends remote-git
// SourceHut (git.sr.ht): a mirror of the source (.github/bos.json "mirrors"); a self-hosted SourceHut keeps
// scope repositories private (__WORKSHOP/AGENTS.md). Only its place in the hierarchy so far.
import { RemoteGit } from "./remote-git.ts";

export class SourceHut extends RemoteGit {
  static override readonly domain: string = "git.sr.ht";
}
