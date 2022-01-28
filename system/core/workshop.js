/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/
const fs=require("fs");
const path=require("path");
const {BOS, HOSTNAME}=require("./main.js");
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
    this.configurationPath=""
  }
  saveConfiguration(filepath, readable=false){
    var configuration={
      "archives":[],
      "forges":[],
      //"sarcophags":[],
      "superprojects":[],
      "projects":[],
      "shemes":[],
      "throwboxes":[]
    };
    for(var i in configuration){
      for(var j in this[i]){
        configuration[i].push(
          this[i][j].getRaport()
        );
      }
    }
    //this.configuration.enviroment
    configuration.hostname=HOSTNAME;
    this.configuration[path.basename(filepath, ".json")]=configuration;
    fs.writeFileSync(
      filepath,
      JSON.stringify(
        ...(
          (readable)
          ?
          [configuration, null, '\t']
          :
          [configuration]
        )
      )
    );
  }
  loadConfiguration(dirpath){
    var configuration={};
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
    var output=[];
    for(var i in this[type]){
      if(this[type][i].name==name)output.push(this[type][i]);
    }
    if(output.length()==1){
      return output[0];
    }else if(output.length()>1){
      return output;
    }else return null;
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
    superprojectHook.workshop=this;
    this.superprojects.push(superprojectHook);
    this.emitter.emit('add-superproject');
  }
  addNewSheme(shemeHook){
    shemeHook.workshop=this;
    this.shemes.push(shemeHook);
    this.emitter.emit('add-sheme');
  }
  addNewProject(projectHook){
    projectHook.workshop=this;
    this.projects.push(projectHook);
    this.emitter.emit('add-project');
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
