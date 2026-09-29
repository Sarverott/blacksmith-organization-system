# new-component

`new-component <name>`

Creates the public GitHub repository `<owner>/bos.<name>` from
`<owner>/bos_component_template` (needs the `gh` CLI, logged in) and adds it as
a submodule at `src/components/<name>` of the BOS repository.
`<owner>` is `$BOS_GITHUB_OWNER`, else the local user name.
Port of `bos_component_create.sh` and `submodule_bos.sh`.
