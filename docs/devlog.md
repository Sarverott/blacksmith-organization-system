# ENTRY 1:
this is huge mess, i had overartistic phase about code, because of lack of reasoning in work. now it's time to list things to cutoff:
  - strange require builder in libraries.js: i remember why it was like that - for easy morphing into browser-only service system... but it's dumb implementation of this idea, i had no clear idea how to do that
  - every referencable var in module will be prioritized to be global scoped exclusively in file for reduction of too long reference chains and information noise generation by bad readability caused by text overwhelmnes in result
  - prettification of staff
  -

# entry 2:
model is autodeclaring own internals
|model-dir:
 - class.js - declaration of model
 - fundation.json - data structure of model
 - README.md - about that type
  |action:
    commands and available acts
  |listeners:
    all watchers and other stuff
  |events:
    basic behaviour
