//const {debug} = require('carnival-toolbox');

const BOS = require('../../core/bos.js');

function command(...args){
  if(args[0]=="workshop"){
    console.log(BOS.SCOPE_ROOT);
  }else if(args[0]=="forge"){

  }else if(args[0]=="archive"){

  }else if(args[0]=="interfaces"){
    console.log(BOS.INTERFACES);
  }
}
module.exports=command;

//const COMMAND=new BOS.FACTORS.Command("debug");

//COMMAND.USAGE("cli").DEFINE.GET=()=>{
//  debug.log(COMMAND.constructor);
//  return COMMAND;
//}

//COMMAND.USAGE("cli").DEFINE.SET=(exitCode)=>{
//  //this.INTERFACE.EXITCODE=exitCode;
  //this.INTERFACE.MAIN.close()
//  debug.log(exitCode);
//}


//module.exports=COMMAND;
