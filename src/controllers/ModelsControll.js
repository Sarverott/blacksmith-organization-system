const fs = require("fs");
const path = require("path");

const Controller = require("../core/bos.controller.js");
const helpers = require("../core/helperFunctions.js");
//const { changeCase, capitalFirst, debug } = require("carnival-toolbox");

function loadModelExtenders(extendersType, modelname, projectDir) {
  var extenders = {};
  var extenderList = fs
    .readdirSync(
      path.join(projectDir, "src", "models", modelname, extendersType),
      {
        withFileTypes: true,
      }
    )
    .filter((extender) => extender.isFile())
    .map((extender) => extender.name);
  for (var extenderName of extenderList) {
    extenders[path.basename(extenderName, ".js")] = require(path.join(
      projectDir,
      "src",
      "models",
      modelname,
      extendersType,
      extenderName
    ));
  }
  return extenders;
}

function LoadAllModels(controllerHook) {
  const modelsList = ListModelsDir(controllerHook.projectDir);
  const modelsItems = {};
  for (var model of modelsList) {
    modelsItems[model] = LoadModel(model, controllerHook.projectDir);
  }
  return modelsItems;
}
function LoadModel(name, projectDir) {
  //debug.log("MODEL-LOAD:", [name]);
  //console.log(name);
  var modelItem = require(path.join(
    projectDir,
    "src",
    "models",
    name,
    "class.js"
  ));
  modelItem.defaultData = JSON.parse(
    fs.readFileSync(
      path.join(projectDir, "src", "models", name, "data.json")
    )
  );
  modelItem.actions = loadModelExtenders("actions", name, projectDir);
  modelItem.events = loadModelExtenders("events", name, projectDir);
  modelItem.listeners = loadModelExtenders("listeners", name, projectDir);
  modelItem.methods = loadModelExtenders("methods", name, projectDir);
  //var modelname = changeCase(name).from("camelcase").to("pascalcase").GO;
  //this.HookRef(this.MODELS[name], modelname);
  return modelItem;
}
function ListModelsDir(projectDir) {
  return fs
    .readdirSync(path.join(projectDir, "src", "models"), {
      withFileTypes: true,
    })
    .filter((model) => model.isDirectory())
    .map((model) => model.name);
}

class ModelsControll extends Controller {
  LOAD() {
    this.context.MODELS = LoadAllModels(this);
    for(var modelname in this.context.MODELS){
      this.context[
        helpers.capitalFirstLetter(modelname)
      ]=this.context.MODELS[modelname];
    }
  }
}

module.exports = ModelsControll;
