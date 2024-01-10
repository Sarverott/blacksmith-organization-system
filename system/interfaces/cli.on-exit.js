/*
  ON EXIT 
*/
var CliHook=null;
var InterfaceHook=null;

function ON_EVENT(e){

}


module.exports={
  set INTERFACE(HOOK){
    InterfaceHook=HOOK;
  },
  set CLI(HOOK){
    CliHook=HOOK;
  },
  ON_EVENT
}
