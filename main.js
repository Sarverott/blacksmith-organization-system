const {BOS}=require("./system/core/main.js");

if(require.main===module){

  //console.log(BOS);
  BOS.EXEC_PROCEDURE("fsdafdsad");

  var factory=new BOS.Workshop(
    "workshop-name",
    BOS.FROM_ROOTDIR("Workshop")
  );

  console.log(factory);
  console.log(BOS.TypeList);
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
}else{
  module.exports=BOS;
}
