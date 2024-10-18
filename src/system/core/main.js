/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/

//const SE=require("./static-extender.js");

//const {caseX}=require('carnival-toolbox');
const child_process = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");

const Controller = require("./controller.js");
const helpers = require("./helperFunctions.js");

class BlacksmithOrganizationSystem extends EventEmitter {
  constructor(classname, modelDir) {
    super();
    Object.assign(this, this.constructor.defaultData);
    this.type = classname.replace("Blacksmith", "");
    for (var eventname in this.constructor.events) {
      this.on(eventname, this.constructor.events[eventname]);
    }
    for (var methodname in this.constructor.methods) {
      this[methodname] = this.constructor.methods;
    }
    for (var listenername in this.constructor.listeners) {
      this.constructor.listeners[listenername](
        this,
        listenername,
        this.constructor
      );
    }

    //this.readIndex();
    //this.openManuals();
    //this.eventEmitter=new eventEmitter();

    //this.loadMethods(modelDir);
    //this.loadExtenders(modelDir);
    //this.loadEvents(modelDir);
    //this.loadActions(modelDir);
    //this.loadListeners(modelDir);
  }

  //includeComponents(modelDir){

  //  this.constructor.actions=fs.readdirSync(path.join(modelDir, "actions"));
  //}
  //readIndex(){

  //}
  //openManuals(){

  //}
  /*
  static GetModelScripts(section, modelDir){
    return fs.readdirSync(
      path.join(
        modelDir,
        section
      ),
      {withFileTypes:true}
    ).filter(
      (script)=>script.isFile()&&script.name.endsWith(".js")
    ).map(
      (direntItem)=>direntItem.name
    );
  }
  loadEvents(modelDir){ // direct listeners and emitters of model
    const modelScripts=BOS.GetModelScripts(
      "events",
      modelDir
    );

  }
  loadActions(modelDir){// acts like deamons or child precesses
    const modelScripts=BOS.GetModelScripts(
      "actions",
      modelDir
    );
  }
  loadListeners(modelDir){// everything what that model listens
    const modelScripts=BOS.GetModelScripts(
      "listeners",
      modelDir
    );
  }
  loadMethods(modelDir){// synchronous, returns data
    const modelScripts=BOS.GetModelScripts(
      "methods",
      modelDir
    );
  }
  loadExtenders(modelDir){// extensionpacks for model
    const modelScripts=BOS.GetModelScripts(
      "extenders",
      modelDir
    );
    for(var scriptName of modelScripts){
      Object.assign(
        this,
        require(
          path.join(
            modelDir,
            "extenders",
            scriptName
          )
        )
      );
    }
  }
    */
  static get Subject() {
    return require("./basic-subject-model.js")(BOS);
  }
  static PathTo(...locationChain) {
    return path.join(__dirname, "..", "..", ...locationChain);
  }
  static get BOS() {
    return BlacksmithOrganizationSystem;
  }
  get BOS() {
    return BlacksmithOrganizationSystem;
  }
  static get INITIALIZE() {

    this.EVENTS = new EventEmitter();

    this.CONTROLLERS = Controller.IncludeAll(this.PathTo("."), this);
    this.CONTROLLERS.ConfigControll.LOAD();
    this.CONTROLLERS.ModelsControll.LOAD();
    this.CONTROLLERS.CommandsControll.LOAD();
    this.CONTROLLERS.InterfacesControll.LOAD();
    this.CONTROLLERS.BridgesControll.LOAD();
    //this.MODELS = LoadAllModels(this.PathTo("."));
    //console.log(BOS.CONFIG);
    
    return this;
  }
  static BOX_EMPTY(boxHook) {
    return Object.keys(boxHook).length == 0;
  }
  static get LOAD() {

    BOS.EVENTS.emit("run-startup-script", BOS.CONFIG.main.startup, BOS);
    //if(this.BOX_EMPTY(CONTROLLERS))this.LoadAllControllers();
    //if(this.BOX_EMPTY(MODELS))this.LoadAllModels();
    //if(this.BOX_EMPTY(FACTORS))this.LoadAllFactors();
    //if(this.BOX_EMPTY(COMMANDS))this.LoadAllCommands();
    /*}
    for(var i in loadList){
      if(
        (
          limiter.length==0
          ||
          limiter.includes(i)
        )
        &&
        loadList[i][0])
      ){
        this[
          loadList[i][1]
        ]();
      }
    }*/
   
    return this;
  }
  //static debugLog(...args){
  //  if(BOS.DEBUGGING)console.log(...args);
  //}
}

//BOS.DEBUGGING=false;

//BOS=BlacksmithOrganizationSystem;
//BOS.INIT_BASE();
//BOS.TypeList=TYPES_LIST;
//BOS.IdRegistList=ID_REJESTR

//const FORM=require('./extending-mod.js')(BOS);
//BOS.Update({
// CONTROLLERS,
// MODELS,
//  ID_REJESTR,
//  FACTORS,
/// INTERFACES,
//  COMMANDS
//});
//BOS.LOAD();
//BOS.loadInterface()
const BOS = BlacksmithOrganizationSystem;

BOS.CONFIG = {};
BOS.CONTROLLERS = {};
BOS.MODELS = {};
BOS.FACTORS = {};
BOS.INTERFACES = {};
BOS.COMMANDS = {};

//
module.exports = BlacksmithOrganizationSystem;
/*

module.exports={
  BOS,
  get INITIALIZE(){
    return BOS.INITIALIZE;
  }
  //CONTROLLERS,
  //MODELS,
  //ID_REJESTR,
  //FACTORS,
  //INTERFACES,
  //COMMANDS
  //ID_REJESTR
  //FORM

  //SE
  //HOSTNAME
};
*/
