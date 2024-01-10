const path = require('path');

const {loadJSON} = require('carnival-toolbox');

const HOOKS={
  BOS:null,
  INTERFACE:null,
  CLI:null
}

const COMMAND={
  HOOKS,
  EXEC:{
    help:loadJSON(path.join(__dirname, "command.json")).description,
    action(...data){
      console.log("HELLO WORLD!");
      console.log(BOS.LOAD_ALL_MODELS());
    }
  }
}


module.exports=COMMAND
