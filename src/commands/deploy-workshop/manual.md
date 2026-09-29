# deploy-workshop

`deploy-workshop`

Creates the active workshop root and every area listed in `config/workshop.json`
that does not exist yet, and writes `bos-workshop.log` on first deploy.
Existing directories are never touched. Port of `deploy-new-workshop.sh`.
