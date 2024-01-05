if(require.main===module){
  require("./invoke-terminal.js");
}else{
  module.exports=require("./system/core/main.js").BOS;
}
