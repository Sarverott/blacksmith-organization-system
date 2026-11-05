# INQUIRIES: work asked for in the owner's own words

Written below the line. Agents turn each inquiry into the plan (VISION,
ROADMAP, TODO), move it word for word into the changelog, and leave this file
with its header only.

---


## more to be printed about package among readme files

- https://bundlephobia.com/package/blacksmith-organization-system
- https://socket.dev/npm/package/blacksmith-organization-system
- https://snyk.io/advisor/npm-package/blacksmith-organization-system
- https://npmgraph.js.org/?q=blacksmith-organization-system
- feeding virustotal with all of release files: https://www.virustotal.com/


## release tag to be created and updated on each 
- latest release that was published:s https://github.com/Sarverott/blacksmith-organization-system/releases/tag/latest
- dev early revision pre-releasing: https://github.com/Sarverott/blacksmith-organization-system/releases/tag/nightly
- that passes all tests from deployment and depending projects that also is placed in "releasing" branch [later on to be implemented]: https://github.com/Sarverott/blacksmith-organization-system/releases/tag/stable

## every commit in dev branches bumps hotfix
it should at local level bump Z number before commit of semver (vX.Y.Z) so every commit has now own version. these can be placed in husky hooks but remember to invoke disabling var for husky while bumping version (increment command like `npm version` makes commit so if we place in pre-commit version shift it ends up with infinite loop of DDoS)
