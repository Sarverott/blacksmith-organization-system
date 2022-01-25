const {BOS}=require("./system/core/main.js");
const fs=require("fs");
const os=require("os");

var factory=new BOS.Workshop();
//factory.loadConfiguration("./tmp-enviroment/config");
//factory.archivesSetup(...factory.configuration.main.archives);
//factory.forgesSetup(...factory.configuration.main.forges);

factory.archivesSetup({
  name:"main-archive",
  path:`${os.homedir()}/tmp-enviroment/workspace/arch`
});
factory.forgesSetup({
  name:"main-forge",
  path:`${os.homedir()}/tmp-enviroment/workspace/forg`
});
var mainforge=factory.getByName("forges", "main-forge");
mainforge.createSuperproject("smiling-shadow-all-attempts");
mainforge.createProject("smiley-animator", "smiling-shadow-all-attempts");
mainforge.createSheme("sketches-and-drawings", "smiling-shadow-all-attempts");
//factory.getByName("forges", "main-forge").createSuperproject();
console.log(factory);
