/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/

const HOSTNAME="setternet-C1";

const EventEmitter = require('events');
const fs=require("fs");

var BOS=null;//just another shorter alias

class BlacksmithOrganizationSystem{
  constructor(...args){
    this.id=BlacksmithOrganizationSystem.idList("register", this);
    this.emitter=new EventEmitter();
    this.beforeConstruct(...args);
    this.setup(...args);
    this.afterConstruct(...args);
  }
  setup(){}
  beforeConstruct(){}
  afterConstruct(){}
  safeCreateDir(path){
    fs.mkdirSync(path,{recursive:true})
  }
  getRaport(){
    return {
      id:this.id
    };
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



  static safeInitIDs(){
    if(typeof BOS.allIDs==='undefined')BOS.allIDs={};
    if(typeof BOS.counters==='undefined')BOS.counters={};
  }
  static getByID(id){
    //var BOS=BlacksmithOrganizationSystem;
    return BOS.idList("get-id", id);
  }
  static listIDs(){
    //var BOS=BlacksmithOrganizationSystem;
    BOS.safeInitIDs();
    return Object.keys(BOS.allIDs);
  }
  static idList(action, item){
    //var BOS=BlacksmithOrganizationSystem;
    BOS.safeInitIDs();
    switch(action){
      case "register":
          var objectType=item.constructor.name.substring(10).toLowerCase();
          if(BOS.counters.hasOwnProperty(objectType))++BOS.counters[objectType];
          else BOS.counters[objectType]=0;
          var tmpId=`${HOSTNAME}-${objectType}-${BOS.counters[objectType]}`;
          BOS.allIDs[tmpId]=item;
          return tmpId;
        break;
      case "get-id":
          return BOS.allIDs[item];
        break;
    }
  }
};

BOS=BlacksmithOrganizationSystem;

module.exports={
  BOS,
  HOSTNAME
};
