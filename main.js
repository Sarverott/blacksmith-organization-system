if(require.main===module){
  const path = require('path');
  const fs = require('fs');

  const invokingChain=process.argv.slice(1).filter(
    (str)=>str!=__filename
  );
  //console.log(process.argv);

  if(
    fs.existsSync(
      path.join(
        __dirname,
        `invoke-${invokingChain[0]}.js`
      )
    )
  ){
    require(
      path.join(
        __dirname,
        `invoke-${invokingChain[0]}.js`
      )
    )(invokingChain.slice(1));
  }else{
    console.error("UNKNOWN METHOD: ", invokingChain[0]);
    console.log("full command argumenting chain: ", invokingChain);
    console.log("full command: ", process.argv);
  }
  //console.log(invokingChain);
  //
}else{
  module.exports=require("./system/core/main.js").BOS.INITIALIZE;
}
