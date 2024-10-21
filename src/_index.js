const process = require("process");

if(require.main===module){
  
  const RUNNER = require("./system/_run.js");

  RUNNER(process.argv);

}else{

  module.exports=require("./system/_load.js");

}
