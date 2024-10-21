/*
  ON EXIT
*/
var INTERFACE=null;

function ON_EXIT_CLI_EVENT(){
  //INTERFACE.LOOP(line);
  //console.log(INTERFACE);
  INTERFACE.clearTerminal();
  INTERFACE.endscreen();
  process.exit(INTERFACE.EXITCODE)
}

module.exports=function(HOOK){
  INTERFACE=HOOK;
  return ON_EXIT_CLI_EVENT
}
