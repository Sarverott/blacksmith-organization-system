/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/
const BOS = require("../../core/main.js");
//const {} = require('carnival-toolbox');

//const MODEL=(BOS)=>(

class BlacksmithSuperproject extends BOS {
  constructor(dirpath, parrent=null) {
    super(this.constructor.name, dirpath, parrent);
  }
}

module.exports = BlacksmithSuperproject;
