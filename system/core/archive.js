/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/
const fs=require("fs");
const path=require("path");
const {BOS}=require("./main.js");
class BlacksmithArchive extends BOS{
  setup(workshopHook, dirpath, name=path.basename(dirpath)){
    this.workshop=workshopHook;
    this.safeCreateDir(dirpath);
    this.name=name;
    this.dirpath=dirpath;
    this.dirlist=fs.readdirSync(dirpath,{withFileTypes:true});
    this.sarcophags=[];
    for(var i in this.dirlist){
      if(
        this.dirlist[i].isFile()
        &&
        path.extname(this.dirlist[i].name)==".sarc"
      ){
        this.sarcophags.push(
          new BOS.Sarcophag(this.dirlist[i].name, this.dirpath)
        );
      }
    }
    getRaport(){
      return {
        id:this.id,
        path:this.dirpath,
        name:this.name
        //contains:this.subjects.map(function(subject){
        //  return subject.id
        //})
      };
    }
    //this.workshop.emitter.emit('archive-created');
  }

  //.isDirectory()
  //.isFile()
  //.name
};
module.exports=BlacksmithArchive;
