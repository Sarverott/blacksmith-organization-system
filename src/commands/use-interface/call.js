//const {debug} = require('carnival-toolbox');

const BOS = require('../../core/bos.js');

function command(...args){
  if(BOS.INTERFACES.hasOwnProperty(args[0])){
    if(args[1]=="open"){
      BOS.INTERFACES[args[0]].INIT()
    }else if(args[1]=="close"){

    }else if(args[1]=="reload"){

    }else if(args[1]=="status"){

    }
  }else{
    console.error("ERROR: interface not recognised!");
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
