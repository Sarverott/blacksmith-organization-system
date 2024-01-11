const vm = require('vm');

var INTERFACE=null;

function ON_LINE_CLI_EVENT(line){
  //INTERFACE.LOOP(line)
  const inputScript = new vm.Script(line);
  //const supercontext={BOS}
  //INTERFACE.CONTEXT=Object.assign({},INTERFACE.CONTEXT)
  vm.createContext(INTERFACE.CONTEXT);
  //console.log(INTERFACE.CONTEXT);
  try{
    console.log(inputScript.runInContext(INTERFACE.CONTEXT));
  }catch(e){
    console.log(e);
  }
  INTERFACE.MAIN.prompt();
  //console.log(INTERFACE);
}

module.exports=function(HOOK){
  INTERFACE=HOOK;
  return ON_LINE_CLI_EVENT;
}
