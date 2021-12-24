/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/
class BlacksmithOrganizationSystem{
  constructor(...args){
    this.listeners=[];
    this.beforeConstruct(...args);
    this.setup(...args);
    this.afterConstruct(...args);
  }
  setup(){}
  beforeConstruct(){}
  afterConstruct(){}
  addEventListener(eventName, action){
    this.listeners.push({
      event:eventName,
      action:action
    });
  }
  removeEventListeners(eventName){
    this.listeners=this.listeners.filter(function(listener){
      return listener.event!=eventName;
    });
  }
  reactToEvent(eventName, ...args){
    var outputPromises=[];
    var tmpThis=this;
    for(var i in this.listeners){
      if(this.listeners[i].event==eventName){
        outputPromises.push(new Promise(function(resolve){
          tmpThis.listeners[i].action(tmpThis, ...args);
          resolve();
        }));
      }
    }
    return new Promise(function(resolve){
      for(var i in outputPromises){
        await outputPromises[i];
      }
      resolve();
    });
  }
  static addSubject(item){
    if(typeof(BlacksmithOrganizationSystem.subjects)=="undefined"){
      BlacksmithOrganizationSystem.subjects=[];
    }
    BlacksmithOrganizationSystem.subjects.push(item);
  }
  static addSarcophag(){

  }
  static get Workshop(){return require("./workshop.js");}
  static get Throwbox(){return require("./throwbox.js");}
  static get Forge(){return require("./forge.js");}
  static get Project(){return require("./project.js");}
  static get Sacrophag(){return require("./sacrophag.js");}
  static get Sheme(){return require("./sheme.js");}
  static get Archive(){return require("./archive.js");}
  static get Subject(){return require("./subject.js");}
  static get Superproject(){return require("./superproject.js");}
};
module.exports={
  BOS:BlacksmithOrganizationSystem,
  extras:require("./extras.js")
};
