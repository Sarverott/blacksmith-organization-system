// extends remote-git
// Bitbucket (bitbucket.org): a mirror of the source (.github/bos.json "mirrors"); a self-hosted Bitbucket keeps
// scope repositories private (__WORKSHOP/AGENTS.md). Only its place in the hierarchy so far.
import { RemoteGit } from "./remote-git.ts";

export class Bitbucket extends RemoteGit {
  static override readonly domain: string = "bitbucket.org";
}
