/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/

const SE=require("./static-extender.js");

const {caseX}=require('carnival-toolbox');
const child_process = require('child_process');
const os = require('os');
const TYPES_LIST = {}
const ID_REJESTR = {}

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

  static INIT_CLASSES(){
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
  static EXTENDPACK(functPack){
    //console.log(require(`../internal-methods/${functPack}.js`));
    Object.assign(BOS, require(`../internal-methods/${functPack}.js`)(BOS));
  }
  static INIT_BASE(){
    BOS.EXTENDPACK("libraries");
    BOS.HOSTNAME=os.hostname();
    BOS.INIT_CLASSES();
    BOS.EXTENDPACK("cli-interface");
  }
  static EXEC_PROCEDURE(procedureName, ...args){
    //console.log(__dirname);
    child_process.execFileSync(
      BOS.path.join(__dirname, "..", "..", "shell-procedures", procedureName+".sh"),
      args
    );
  }
  static SAVE_CONFIG(){
    for(var i in ID_REJESTR){
      console.log(BOS.FROM_ROOTDIR("config", `${i}.json`));
      console.log(JSON.stringify(ID_REJESTR[i]));
      console.log("_");
    }
  }
  static get WORKSHOP_DEPLOYED(){
    return BOS.fs.existsSync(BOS.FROM_ROOTDIR());
  }
  static FROM_ROOTDIR(...args){
    return BOS.path.join(os.homedir(), ".__WORKSHOP", ...args);
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
      ID_REJESTR[id]=item;
    }
    return id;
  }
  static get Subject(){
    return require(`./subject.js`)(BOS);
  }
  static INCLUDE_CLASS(className){
    if(!TYPES_LIST.hasOwnProperty(className)){
      TYPES_LIST[className]=require(`./${className}/class.js`)(BOS);
      TYPES_LIST[className].INFO_STATS={
        idRecord:{},
        get count(){
          return Object.keys(this.idRecord).length;
        }
      };
      TYPES_LIST[className].LISTENERS=require(`./${className}/listeners.js`);
      TYPES_LIST[className].LOAD_EVENT=require(`./${className}/events/load.js`);
      TYPES_LIST[className].SAVE_EVENT=require(`./${className}/events/save.js`);
      TYPES_LIST[className].RECEIVE_EVENT=require(`./${className}/events/receive.js`);
      TYPES_LIST[className].TRANSMIT_EVENT=require(`./${className}/events/transmit.js`);
      Object.defineProperty(TYPES_LIST[className], "HELP_NOTE", {
        get(){
          return fs.readFileSync(`./${className}/README.md`);
        }
      });
      var tmpType=TYPES_LIST[className];
      var elementname=caseX.transform(className).from("camelcase").to("pascalcase").GO;
      Object.defineProperty(
        BOS,
        elementname,
        {get(){return tmpType;}}
      );
    }
    return TYPES_LIST[className];
  }
};


BOS=BlacksmithOrganizationSystem;
BOS.INIT_BASE();
BOS.TypeList=TYPES_LIST;
BOS.IdRegistList=ID_REJESTR

module.exports={
  BOS,
  SE
  //HOSTNAME
};
