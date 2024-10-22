const process = require("process");

if(process.connected){

  const SUBPROCESS = require("./spawner.js");
  
  SUBPROCESS

}else if(require.main===module){
  
  const RUNNER = require("./runner.js");

  RUNNER(process.argv);

}else{

  const INCLUDER=require("./includer.js");

  module.exports=INCLUDER(require.main);

}