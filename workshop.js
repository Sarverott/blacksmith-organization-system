/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/
const {BOS, extras}=require("./main.js");
class BlacksmithWorkshop extends BOS{
  setup(archivePath, forgeWorkPath){
    var list=extras.getDirContent(archivePath);
    this.archive
    for(var i in list){
      var ext=list[i].name.split(".").pop().toLowerCase();
      if(ext=="bos"){

      }else if(
        ext=="sqlite"
        ||
        ext=="db"
        ||
        ext=="sqlite3"
      ){

      }
    }
  }
  cleanWorkshop(){
    this.reactToEvent("before-clean");
    try{

      this.reactToEvent("after-succesfull-clean");
    }catch(e){

      this.reactToEvent("after-clean-error");
    }
    this.reactToEvent("after-clean");
  }
  isOccupated(){

  }
  createWorkshop(){
    this.reactToEvent("workshop-create");
  }
  createForge(){
    new BOS.Forge();
  }
  createArchive(){
    new BOS.Archive();
  }
  openArchive(){

  }
  openForge(){

  }
  readConfig(){

  }
          //czy znasz gościa w cmentarnych szatach z misiem pod pachą
};
module.exports=BlacksmithWorkshop;
