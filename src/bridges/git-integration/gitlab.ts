// extends remote-git
// GitLab (gitlab.com): a mirror of the source (.github/bos.json "mirrors"); a self-hosted GitLab keeps
// scope repositories private (__WORKSHOP/AGENTS.md). Only its place in the hierarchy so far.
import { RemoteGit } from "./remote-git.ts";

export class GitLab extends RemoteGit {
  static override readonly domain: string = "gitlab.com";
}
