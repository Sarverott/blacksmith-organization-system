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
/*
const {BOS}=require("./system/core/main.js");

if(require.main===module){
  const os=require("os");

  var factory=new BOS.Workshop("workshop-name");

  //factory.loadConfiguration("./tmp-enviroment/config");
  //factory.archivesSetup(...factory.configuration.main.archives);
  //factory.forgesSetup(...factory.configuration.main.forges);

  //factory.archivesSetup({
  //  name:"main-archive",
  //  path:`${os.homedir()}/tmp-enviroment/workspace/arch`
  //});

  //factory.forgesSetup({
  //  name:"main-forge",
  //  path:`${os.homedir()}/tmp-enviroment/workspace/forg`
  //});

  factory.forgesSetup(
    {
      name:"small-A1-forge",
      path:`/path/to/forge`
    },
    {
      name:"fresh-A9-forge",
      path:`/path/to/forge`
    },
    {
      name:"old-A7-parted-forge",
      path:`/path/to/forge`
    }
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
*/
