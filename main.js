const {BOS}=require("./system/core/main.js");
const os=require("os");

if(require.main===module){

  var factory=new BOS.Workshop();

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
      path:`/media/sarverott/setternet-A1/forge`
    },
    {
      name:"fresh-A9-forge",
      path:"/mnt/FFFFFFFFFFFFFFFF/#WORKSHOP#/#FORGE#"
    },
    {
      name:"old-A7-parted-forge",
      path:"/mnt/EEEEEEEEEEEEEEEE/workshop"
    }
  );
  for(var i in factory.forges)factory.forges[i].loadDirContentAsForge();

  //var mainforge=factory.getByName("forges", "main-forge");
  //mainforge.createSuperproject("smiling-shadow-all-attempts");
  //mainforge.createProject("smiley-animator", "smiling-shadow-all-attempts");
  //mainforge.createSheme("sketches-and-drawings", "smiling-shadow-all-attempts");
  //factory.getByName("forges", "main-forge").createSuperproject();

  console.log(factory);
}else{
  module.exports=BOS;
}
