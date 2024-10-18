const fs = require("fs");
const path = require("path");

const Controller = require("../core/controller.js");
const BOS =  require("../core/main.js");

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

function SAFE_CREATE_DIR(dirpath){
  fs.mkdirSync(path.normalize(dirpath),{recursive:true})
}

class ScopeControll extends Controller {
  LOAD() {}
}

module.exports = ScopeControll;
