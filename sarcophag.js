/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/
const {BOS, extras}=require("./main.js");
class BlacksmithSarcophag extends BOS{
  setup(name, path, key=null){
    this.path=path;
    this.name=name;
    this.key=key;
  }

};
module.exports=BlacksmithSarcophag;
