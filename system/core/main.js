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

const TYPES_LIST = {}
const ID_REJESTR = {}

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
    if(TYPES_LIST.keys().length==0)this.LOAD_ALL_MODELS();
    return this;
  }
  static LOAD_ALL_MODELS(){
    const models=this.ListModelsDir();
    for(var model of models){
      this.LoadModel(model);
    }
  }
};

BOS=BlacksmithOrganizationSystem;
//BOS.INIT_BASE();
BOS.TypeList=TYPES_LIST;
BOS.IdRegistList=ID_REJESTR

const FORM=require('./extending-mod.js')(BOS);

const autolistControllers=fs.readdirSync(__dirname).filter(
  (filename)=>filename.endsWith("-controll.js")
).map(
  (name)=>path.basename(name, ".js")
);
for(var item of autolistControllers){
  BOS.loadController(item);
  console.log(item)
}

//BOS.loadInterface()

module.exports={
  BOS,
  TYPES_LIST
  //ID_REJESTR
  //FORM

  //SE
  //HOSTNAME
};
