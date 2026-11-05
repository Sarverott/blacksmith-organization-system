# INQUIRIES: work asked for in the owner's own words

Written below the line. Agents turn each inquiry into the plan (VISION,
ROADMAP, TODO), move it word for word into the changelog, and leave this file
with its header only.

---

## for wiki 
clone "https://github.com/Sarverott/blacksmith-organization-system.wiki.git" into docs/.gh-wiki
place in gitignore docs/.gh-wiki/
each update of documentation should be also place these docs to github wiki in compatible with wikijs formating 
all like `_sidebar.md`, `_footer.md`, `Home.md` and else specific for github wiki files should be generated according tamplating placed in "resources/docs-templates" and coded in python that will be placed in scripts

## reduce content of "scripts/" to only required ones
all that can be ported to typescript should be ported to typescript

## more complex way of github workflows and actions
we should act with routines. for this we will reduce some of loop requirements 
- when we push development to master - bump semver as hotfix
- each step is commit, each commit can be pushed into origin's development
- when you stop work and need user's response - merge own dev to development, then push local to remote, then create PR from developement to master and push developement to revision branch
- when something lands on revision bump semver as minor
- let's place all checks and tests at workflow on PR testing

