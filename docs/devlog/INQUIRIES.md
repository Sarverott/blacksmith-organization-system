# INQUIRIES: work asked for in the owner's own words

Written below the line. Agents turn each inquiry into the plan (VISION,
ROADMAP, TODO), move it word for word into the changelog, and leave this file
with its header only.

---

## relocate PR from dev
after we push `development -> revision` instead of creation PR from dev branch we can do it as part of revision. let's move it like that so next up we can make it be shaped to proper way we aim to.

## workflow title names and filenames
it is hard to not be missleaded by names like "check.yml" and "checks.yml" - make them longer and selfexplanatory
also inside we have property "name" so this can be also more concrete there

## the AUTHORS file
it is AUTHORS or .github/AUTHORS or .github/AUTHORS.csv or something like that
here we should place all entities that make this project
example entry:
```
Sarverott   "Sett Sarverott A.A.B."   <sett@sarverott.com>  (https://sett.sarverott.com)
```
later it can be updated with sign mechanics. something like that in future entries:
```
Sarverott   "Sett Sarverott A.A.B."   <sett@sarverott.com>  (https://sett.sarverott.com)    [SIGN::type::public_sign_string]
```
so it is simply in every entry there is something like that
- `entry = $NICKNAME+'\t"'+$NAMED_IDENTITY+'"\t<'+$EMAIL+'>\t('+$URL+')\n'` - full entry
- `entry = $NICKNAME+'\t<'+$EMAIL+'>\n'` - minimalistic yet fullfilling proper verified identity
- `entry = $NICKNAME+'\n'` - unverified, just mentioned, if updated then move to bottom
- `entry = '<'+$EMAIL+'>\n'` - unverified, just mentioned, if updated then move to bottom
all entities present among commits should be placed there
new one appends file if not present there already
dependabot, github actions, users, AI agents - everyone should be written there
collect info about them from git log

## mode badges in README
work with current badges and update them as we want it to be well-presented in every place where it is readme of our project