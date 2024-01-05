/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/
//const {BOS}=require("./../main.js");
module.exports=function(BOS){
  return class BlacksmithSuperproject extends BOS.Subject{
    initializationOfObject(){
      this.children=[];
      this.info={};
    }
    loadConfiguration(){
      //this.info.
    }
    eventListenersSetup(){

    }
  }
}
//BOS.SET_RAPORT(
//  BlacksmithSuperproject,
//  require("./raport-superproject.js")
//);
//module.exports=BlacksmithSuperproject;
