/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/
const BOS = require("../../core/bos.class.js");
//const {} = require('carnival-toolbox');

//const MODEL=(BOS)=>(

class BlacksmithThrowbox extends BOS {
  constructor(dirpath, parrent=null) {
    super(this.constructor.name, dirpath, parrent);
  }
}

module.exports = BlacksmithThrowbox;
