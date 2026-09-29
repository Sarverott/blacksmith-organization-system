# pull-archive

`pull-archive`

For each `.DATA/<pack>.gitlist` in the active workshop (one repository URL per
line, `#` for comments), clones every repository into `archive/<pack>/`.
Repositories already present are fetched instead of cloned again.
Port of `archive_mirrors.sh`.
