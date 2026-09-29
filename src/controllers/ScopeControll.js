const fs = require("fs");
const path = require("path");

const Controller = require("blacksmith-organization-system/core/bos.controller.js");
const BOS = require("blacksmith-organization-system/core/bos.js");
const helpers = require("blacksmith-organization-system/core/helperFunctions.js");

/*
Workshop
_Forge -1dev Xtest Xbuilding
__Superproject
___Project
___Sheme
___Throwbox 
_Archive -1canon Xpublishing
__Sarcophag -for placing canon
__Exhibit -based on sarcophags
_Scrapbook -docs, notes, else
__Chaptergroup
__Mixnotes
_Setup


*/

// every area listed in config/workshop.json must exist; missing ones are created
function ensureWorkshopTree() {
  var root = BOS.WORKSHOP_ROOT;
  var created = [];
  if (!fs.existsSync(root)) created.push(root);
  helpers.SAFE_CREATE_DIR(root);
  for (var area in BOS.CONFIG.workshop.content) {
    var areaPath = path.join(root, area);
    if (!fs.existsSync(areaPath)) {
      helpers.SAFE_CREATE_DIR(areaPath);
      created.push(areaPath);
    }
  }
  return created;
}

function prepareWorkshop() {
  var created = ensureWorkshopTree();
  for (var createdPath of created) {
    console.log("BOS created missing workshop area:", createdPath);
  }
  var workshopHook = new BOS.Workshop(BOS.WORKSHOP_ROOT);
  BOS.SCOPE_ROOT = workshopHook;
  for (var area in BOS.CONFIG.workshop.content) {
    var [areaType] = BOS.CONFIG.workshop.content[area];
    var Model = BOS.MODELS[areaType];
    if (!Model) continue; // area without a model yet: directory only
    workshopHook.childrenItems.push(
      new Model(path.join(BOS.WORKSHOP_ROOT, area), workshopHook)
    );
  }
  return created;
}

class ScopeControll extends Controller {
  LOAD() {
    prepareWorkshop();
  }
  ENSURE_TREE() {
    return ensureWorkshopTree();
  }
}

module.exports = ScopeControll;
