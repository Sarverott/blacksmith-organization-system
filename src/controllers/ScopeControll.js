//const fs = require("fs");
//const path = require("path");
//const os = require("os");

const Controller = require("../core/bos.controller.js");
const BOS = require("../core/bos.js");
const helpers = require("../core/helperFunctions.js");

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

function prepareWorkshop() {
  var workshopHook = new BOS.Workshop(
    BOS.PathTo( BOS.CONFIG.main["context-path"])
  );
  BOS.SCOPE_ROOT = workshopHook;
  helpers.SAFE_CREATE_DIR(
    BOS.PathTo( BOS.CONFIG.main["context-path"], "setup")
  );
  var archiveHook = new BOS.Archive(
    BOS.PathTo( BOS.CONFIG.main["context-path"], "archive"),
    workshopHook
  );
  workshopHook.childrenItems.push(archiveHook);
  var scrapbookHook = new BOS.Scrapbook(
    BOS.PathTo( BOS.CONFIG.main["context-path"], "notes"),
    workshopHook
  );
  workshopHook.childrenItems.push(scrapbookHook);
  var forgeHook = new BOS.Forge(
    BOS.PathTo( BOS.CONFIG.main["context-path"], "forge"),
    workshopHook
  );
  workshopHook.childrenItems.push(forgeHook);
}

class ScopeControll extends Controller {
  LOAD() {
    prepareWorkshop();
  }
}

module.exports = ScopeControll;
