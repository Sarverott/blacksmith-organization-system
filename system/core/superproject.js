/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/
const {BOS}=require("./main.js");
class BlacksmithSuperproject extends BOS.Subject{
  afterConstruct(){
    this.subjects=[];
    this.throwbox=[];
  }
  addSubject(subjectHook){
    this.subjects.push(subjectHook);
    subjectHook.superproject=this;
  }
  addThrowbox(){
    this.throwbox.unshift(new BOS.Throwbox());
    //this.emitter.emit('add-sheme');
  }
  fillThrowbox(){
    this.throwbox[0].fill();
  }
}
module.exports=BlacksmithSuperproject;
