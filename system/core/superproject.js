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
  getRaport(){
    return {
      id:this.id,
      path:this.dirpath,
      name:this.name,
      status:this.content.status,
      includes:this.subjects.map(function(subject){
        return subject.id
      }),
      throwboxes:this.throwbox.map(function(subject){
        return subject.id
      })
    };
  }
}
module.exports=BlacksmithSuperproject;
