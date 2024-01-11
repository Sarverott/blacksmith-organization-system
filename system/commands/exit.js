const {BOS} = require('../core/main.js');

const COMMAND=new BOS.FACTORS.Command("exit");

COMMAND.USAGE("cli").DEFINE.GET=()=>{
  const CONTEXT=COMMAND.CONTEXT["cli"];
  CONTEXT.INTERFACE.EXITCODE=0;
  CONTEXT.INTERFACE.MAIN.close();
  return null;
}

COMMAND.USAGE("cli").DEFINE.SET=(exitCode)=>{
  const CONTEXT=COMMAND.CONTEXT["cli"];
  CONTEXT.INTERFACE.EXITCODE=exitCode;
  CONTEXT.INTERFACE.MAIN.close()
}


module.exports=COMMAND;
