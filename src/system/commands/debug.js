const {debug} = require('carnival-toolbox');

const {BOS} = require('../core/main.js');


const COMMAND=new BOS.FACTORS.Command("debug");

COMMAND.USAGE("cli").DEFINE.GET=()=>{
  debug.log(COMMAND.constructor);
  return COMMAND;
}

COMMAND.USAGE("cli").DEFINE.SET=(exitCode)=>{
  //this.INTERFACE.EXITCODE=exitCode;
  //this.INTERFACE.MAIN.close()
  debug.log(exitCode);
}


module.exports=COMMAND;
