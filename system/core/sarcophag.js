/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/
const {BOS}=require("./main.js");
class BlacksmithSarcophag extends BOS{
  setup(name, dirpath){
    this.name=name;
    this.dirpath=dirpath;
  }

};
module.exports=BlacksmithSarcophag;
