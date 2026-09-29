/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/
const os = require("os");
const fs = require("fs");
const path = require("path");
const BOS = require("blacksmith-organization-system/core/bos.js");
const helpers = require("blacksmith-organization-system/core/helperFunctions.js");
//const {} = require('carnival-toolbox');

//const MODEL=(BOS)=>(

class BlacksmithWorkshop extends BOS {
  SETUP(){}
  static isDeployed() {
    return fs.existsSync(BOS.CONFIG.main.workshop.path);
  }
}

module.exports = BlacksmithWorkshop;
