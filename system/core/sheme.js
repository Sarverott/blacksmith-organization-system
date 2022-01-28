/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/
const {BOS}=require("./main.js");
class BlacksmithSheme extends BOS.Subject{
  afterConstruct(){
    //this.readContent();
  }
  getRaport(){
    return {
      id:this.id,
      path:this.dirpath,
      name:this.name,
      status:this.content.status
    };
  }
};
module.exports=BlacksmithSheme;
