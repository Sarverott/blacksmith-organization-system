# ENTRY 1:
this is huge mess, i had overartistic phase about code, because of lack of reasoning in work. now it's time to list things to cutoff:
  - strange require builder in libraries.js: i remember why it was like that - for easy morphing into browser-only service system... but it's dumb implementation of this idea, i had no clear idea how to do that
  - every referencable var in module will be prioritized to be global scoped exclusively in file for reduction of too long reference chains and information noise generation by bad readability caused by text overwhelmnes in result
  - prettification of staff
  -

# entry 2:
model is autodeclaring own internals
> model directory:
 - **class.js** - declaration of model
 - ~fundation.json~ **index.json** - data structure of model
 - **README.md** - about that type
 - _**actions**_ - _DIR_ commands and available acts
 - _**listeners**_ - _DIR_ all watchers and other stuff
 - _**events**_ - _DIR_ basic behaviour
 - _**extenders**_ - _DIR_ flat extension for every new object, produced by class.js
 - _**methods**_ - _DIR_ synchronous static functions, resulting with return values

# entry 3:
