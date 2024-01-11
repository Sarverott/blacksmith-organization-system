/*
  ON EXIT
*/

var INTERFACE=null;

function ON_RESUME_CLI_EVENT(line){
  INTERFACE.LOOP(line)
  //console.log(INTERFACE);
}

module.exports=function(HOOK){
  INTERFACE=HOOK;
  return ON_RESUME_CLI_EVENT
}
