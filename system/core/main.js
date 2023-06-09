/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/

var hostname="setternet-C1";

const SE=require("./static-extender.js");

class BlacksmithOrganizationSystem{
  constructor(name, path, initOpts={}, configOpts={}, eventOpts={}){
    this.name=name;
    this.path=path;
    if(initOpts.hasOwnProperty("presetID")){
      this.id=BOS.REGIST_ID(this, initOpts.presetID);
    }else{
      this.id=BOS.REGIST_ID(this);
    }

    this.initializationOfObject(initOpts);
    this.loadConfiguration(configOpts);
    this.eventListenersSetup(eventOpts);
  }
  initializationOfObject(){}
  loadConfiguration(){}
  eventListenersSetup(){}

  static INIT_INTERNALS(){
    if(typeof BOS.TypeList == "undefined") BOS.TypeList={};
    if(typeof BOS.IdRegistList == "undefined") BOS.IdRegistList={};
  }
  static INIT_BASE(){
    BOS.INIT_INTERNALS();
    var LibraryList={
      os:require("os"),
      tls:require("tls"),
      crypto:require("crypto"),
      http:require("http"),
      https:require("https"),
      net:require("net"),
      child_process:require("child_process"),
      fs:require("fs"),
      path:require('path'),
      events:require('events'),
      carntools:require('../carnival-toolbox/main.js'),
    };
    BOS.HOSTNAME=hostname;
    Object.assign(BOS, LibraryList);
    var ElementClassList=[
      "workshop",
      "throwbox",
      "forge",
      "project",
      "sarcophag",
      "sheme",
      "archive",
      "superproject",
    ];
    for(var i in ElementClassList){
      BOS.INCLUDE_CLASS(ElementClassList[i]);
    }
  }
  static EXEC_PROCEDURE(procedureName, ...args){
    console.log(__dirname);
    /*
    BOS.child_process.execFileSync(
      BOS.path.join(__dirname, "..", "..", procedureName)
    );
    */
  }
  static FROM_ROOTDIR(...args){
    return BOS.path.join(BOS.os.homedir(), ...args);
  }
  static REGIST_ID(item, id=null){
    //BOS.INIT_INTERNALS();
    if(id===null){
      id="";
      id+=BOS.HOSTNAME;
      id+=".";
      id+=item.constructor.name;
      id+=".";
      id+=item.constructor.INFO_STATS.count;
      item.constructor.INFO_STATS.idRecord[id]=item;
      BOS.IdRegistList[id]=item;
    }
    return id;
  }
  static get Subject(){
    return require(`./subject.js`)(BOS);
  }
  static INCLUDE_CLASS(className){
    if(!BOS.TypeList.hasOwnProperty(className)){
      BOS.TypeList[className]=require(`./${className}/class.js`)(BOS);
      BOS.TypeList[className].INFO_STATS={
        idRecord:{},
        get count(){
          return Object.keys(this.idRecord).length;
        }
      };
      BOS.TypeList[className].LISTENERS=require(`./${className}/listeners.js`);
      BOS.TypeList[className].LOAD_EVENT=require(`./${className}/events/load.js`);
      BOS.TypeList[className].SAVE_EVENT=require(`./${className}/events/save.js`);
      BOS.TypeList[className].RECEIVE_EVENT=require(`./${className}/events/receive.js`);
      BOS.TypeList[className].TRANSMIT_EVENT=require(`./${className}/events/transmit.js`);
      Object.defineProperty(BOS.TypeList[className], "HELP_NOTE", {
        get(){
          return fs.readFileSync(`./${className}/README.md`);
        }
      });
      var tmpType=BOS.TypeList[className];
      var elementname=BOS.carntools.transform(className).from("camelcase").to("pascalcase").GO;
      Object.defineProperty(
        BOS,
        elementname,
        {get(){return tmpType;}}
      );
    }
    return BOS.TypeList[className];
  }
};

BOS=BlacksmithOrganizationSystem;

BOS.INIT_BASE();

module.exports={
  BOS,
  SE
  //HOSTNAME
};
