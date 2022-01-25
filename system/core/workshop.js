/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/
const fs=require("fs");
const path=require("path");
const {BOS}=require("./main.js");
class BlacksmithWorkshop extends BOS{
  //static counter=0;
  setup(){
    this.archives=[];
    this.forges=[];

    this.projects=[];
    this.superprojects=[];
    this.shemes=[];
    this.throwboxes=[];

    this.extensions=[];
    this.configuration={};
  }
  loadConfiguration(dirpath){
    var configList=fs.readdirSync(
      dirpath,
      {withFileTypes:true}
    );
    for(var i in configList){
      if(
        configList[i].isFile()
        &&
        path.extname(configList[i].name)==".json"
      ){
        this.configuration[
          path.basename(configList[i].name, ".json")
        ]=JSON.parse(
          fs.readFileSync(
            path.join(dirpath, configList[i].name)
          )
        );
      }
    }
  }
  getByName(type, name){
    for(var i in this[type]){
      if(this[type][i].name==name)return this[type][i];
    }
    return null;
  }
  archivesSetup(...archiveConfig){
    for(var i in archiveConfig){
      this.archives.push(
        new BOS.Archive(
          this,
          archiveConfig[i].path,
          archiveConfig[i].name
        )
      );
    }
  }
  forgesSetup(...forgeConfig){
    for(var i in forgeConfig){
      this.forges.push(
        new BOS.Forge(
          this,
          forgeConfig[i].path,
          forgeConfig[i].name
        )
      );
    }
  }
  addNewSuperproject(superprojectHook){
    this.superprojects.push(superprojectHook);
  }
  addNewSheme(shemeHook){
    this.shemes.push(shemeHook);
  }
  addNewProject(projectHook){
    this.projects.push(projectHook);
  }
  /*
  uploadSuperprojectDir(source, destination){
    var itemHook=BOS.idList("get-id", destination);
    if(itemHook instanceof BOS.Forge){
      source
      itemHook.addSubject(
        new BOS.Superproject(
          path.join(itemHook.dirpath, name),
          name
        )
      );
    }else if(itemHook instanceof BOS.Archive){

    }
  }
  */
  /*uploadProjectDir(source, superproject, destination=null){
    var itemHook=BOS.idList("get-id", destination);
    if(itemHook instanceof BOS.Forge){
      var tmp=new BOS.Superproject(
        path.join(itemHook.dirpath, name),
        name
      )
      itemHook.addSubject(
        tmp
      );
    }else if(itemHook instanceof BOS.Archive){

    }
    destination
  }*/
          //czy znasz gościa w cmentarnych szatach z misiem pod pachą
};
module.exports=BlacksmithWorkshop;
