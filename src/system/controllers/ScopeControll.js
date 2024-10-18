const fs = require("fs");
const path = require("path");

const Controller = require("../core/controller.js");
const BOS = require("../core/main.js");

/*
Workshop
_Forge
__Superproject
___Project
___Sheme
___Throwbox
_Archive
__Sarcophag
__Exhibit
_Scrapbook
__Chaptergroup
__Mixnotes
_Setup


*/



function prepareWorkshop() {
  BOS.Workshop(BOS.CONFIG.main.workshop.path)
}

class ScopeControll extends Controller {
  LOAD() {}
}

module.exports = ScopeControll;
