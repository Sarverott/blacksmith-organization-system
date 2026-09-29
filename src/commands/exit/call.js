const BOS = require('blacksmith-organization-system/core/bos.js');

// overrides the REPL's built-in .exit, so it has to close the interface itself
function command(){
  if(this.interfaceHook && typeof this.interfaceHook.close=="function"){
    this.interfaceHook.close();
  }
}
module.exports=command;
