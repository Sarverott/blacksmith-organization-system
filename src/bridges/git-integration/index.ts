// plugins that can be applied to various models to extend their capabilities
// propably as interfaces
//
// Git, both ends:  Bridge → Git (git-base) → LocalGit (a clone here)
//                                          → RemoteGit (a place it is pushed to: the source or a mirror)
//                                             → GitHub, Gitea, GitLab, Bitbucket, SourceHut
export * from "./bitbucket.ts";
export * from "./git-base.ts";
export * from "./gitea.ts";
export * from "./github.ts";
export * from "./gitlab.ts";
export * from "./local-git.ts";
export * from "./remote-git.ts";
export * from "./sourcehut.ts";
