/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/
const path=require("path");
const fs=require("fs");
const {BOS}=require("./main.js");
class BlacksmithForge extends BOS{
  setup(workshopHook, dirpath, name=path.basename(dirpath)){
    this.workshop=workshopHook;
    this.safeCreateDir(dirpath);
    this.dirpath=dirpath;
    this.name=name;
    this.subjects=[];
  }
  getSuperprojectByName(name){
    for(var i in this.subjects){
      if(this.subjects[i].name==name)return this.subjects[i];
    }
    return null;
  }
  createSuperproject(name, dirpath=path.join(this.dirpath, name)){
    var superprojectHook=new BOS.Superproject(
      dirpath,
      name
    );
    this.workshop.addNewSuperproject(superprojectHook);
    this.subjects.push(superprojectHook);
  }
  createProject(name, groupName, dirpath=path.join(this.dirpath, groupName, name)){
    var projectHook=new BOS.Project(
      dirpath,
      name
    );
    this.getSuperprojectByName(groupName).addSubject(projectHook);
    this.workshop.addNewProject(projectHook);
  }
  createSheme(name, groupName, dirpath=path.join(this.dirpath, groupName, name)){
    var shemeHook=new BOS.Sheme(
      dirpath,
      name
    );
    this.getSuperprojectByName(groupName).addSubject(shemeHook);
    this.workshop.addNewSheme(shemeHook);
  }
}
module.exports=BlacksmithForge;
