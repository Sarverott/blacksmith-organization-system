
const readline = require('readline');
const repl = require('repl');
const fs = require('fs');
const path = require('path');
const BOS=require("./system/core/main.js").INITIALIZE;

//BOS.LOAD();

const {INTERFACE, CLI} = BOS.LoadInterface("cli");

function mainProcedure(invokeChain){

  INTERFACE.INIT({BOS, INTERFACE, CLI, require});
  //INTERFACE.interface.context=;
  //BOS
  //CLI.textart("logo-header");
  //CLI.print="hello world!";
  //INTERFACE.prompt=".exit";
  //if(!BOS.SYSTEM_DEPLOYED){

    //console.log("deploying workshop at: "+BOS.FROM_ROOTDIR());

    //BOS.EXEC_PROCEDURE("deploy-new-workshop"); // do shell script from shell-procedures

  //}else{

    //console.log("workshop found at: "+BOS.FROM_ROOTDIR());

  //}

  //var factory=new BOS.Workshop(

    //"sarverott-forest",

    //BOS.FROM_ROOTDIR()

  //);

  //console.log(factory);

  //BOS.SAVE_CONFIG();

  //console.log(BOS.TypeList);

  //BOS.START_CLI_INTERFACE();
}

module.exports=mainProcedure;









  //console.log(BOS);
  //BOS.EXEC_PROCEDURE("purge-workshop");

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
  /*
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
  for(var i in factory.items.forges)factory.items.forges[i].loadDirContentAsForge();
  */
//BOS.LOAD_FILE("./tmp-config.json")
  //var mainforge=factory.getByName("forges", "main-forge");
  //mainforge.createSuperproject("smiling-shadow-all-attempts");
  //mainforge.createProject("smiley-animator", "smiling-shadow-all-attempts");
  //mainforge.createSheme("sketches-and-drawings", "smiling-shadow-all-attempts");
  //factory.getByName("forges", "main-forge").createSuperproject();

  //console.log(factory);
  //console.log(BOS.getByID("setternet-C1-superproject-29"));
  //factory.saveConfiguration("./tmp-config.json", true);
  //BOS.SAVE();
  //BOS.SAVE_FILE("./tmp-config2.json", true);
  //BOS.SAVE_DIR("./tmp-config", true);
  //BOS.SAVE_DIRTREE("./tmp-config-full", true);
