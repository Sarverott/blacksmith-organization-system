/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/

//const SE=require("./static-extender.js");

const {caseX}=require('carnival-toolbox');
const child_process = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const CONTROLLERS = {}
const MODELS = {}
const ID_REJESTR = {}
const FACTORS = {}
const INTERFACES = {}
const COMMANDS = {}



class BlacksmithOrganizationSystem extends EventEmitter{
  constructor(classname, modelDir){
    this.type=classname.replace("Blacksmith","");

    //this.readIndex();
    //this.openManuals();
    //this.eventEmitter=new eventEmitter();

    this.loadMethods(modelDir);
    this.loadExtenders(modelDir);
    this.loadEvents(modelDir);
    this.loadActions(modelDir);
    this.loadListeners(modelDir);
  }
  //readIndex(){

  //}
  //openManuals(){

  //}
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
  static get Subject(){
    return require("./basic-subject-model.js")(BOS);
  }
  static PathTo(...locationChain){
    return path.join(__dirname, "..", "..", ...locationChain);
  }
  static get BOS(){
    return this;
  }
  get BOS(){
    return BOS;
  }
  static get INITIALIZE(){
    return BOS.LOAD();
  }
  static BOX_EMPTY(boxHook){
    return Object.keys(boxHook).length==0;
  }
  static LOAD(...limiter){
    if(this.BOX_EMPTY(CONTROLLERS))this.LoadAllControllers();
    if(this.BOX_EMPTY(MODELS))this.LoadAllModels();
    if(this.BOX_EMPTY(FACTORS))this.LoadAllFactors();
    if(this.BOX_EMPTY(COMMANDS))this.LoadAllCommands();
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
};

//BOS.DEBUGGING=false;

BOS=BlacksmithOrganizationSystem;
//BOS.INIT_BASE();
//BOS.TypeList=TYPES_LIST;
//BOS.IdRegistList=ID_REJESTR

const FORM=require('./extending-mod.js')(BOS);
BOS.Update({
  CONTROLLERS,
  MODELS,
  ID_REJESTR,
  FACTORS,
  INTERFACES,
  COMMANDS
});
//BOS.LOAD();
//BOS.loadInterface()

//

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
