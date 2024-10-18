/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/
const os = require('os');
const fs = require('fs');
const path = require('path');
const BOS = require('../../core/main.js');
//const {} = require('carnival-toolbox');

//const MODEL=(BOS)=>(

class BlacksmithWorkshop
extends BOS
  {
    constructor(){
      super(this.constructor.name, __dirname);
    }
    static isDeployed(){
      return fs.existsSync(
        BOS.CONFIG.main.workshop.path
      );
    }
  }




module.exports=BlacksmithWorkshop
