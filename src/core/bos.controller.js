const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");

const helpers = require("./helperFunctions.js");

function LoadAllControllers(projectDir) {
  var controllers = {};
  var controllerList = fs
    .readdirSync(helpers.componentPath(projectDir, "controllers"), {
      withFileTypes: true,
    })
    .filter((item) => item.isFile() && path.extname(item.name) == ".js")
    .map((item) => item.name);

  for (var controll of controllerList) {
    controllers[path.basename(controll, ".js")] = require(
      helpers.componentPath(projectDir, "controllers", controll)
    );
  }
  return controllers;
}

class BOS_Controller extends EventEmitter {
  constructor(projectDir, context) {
    super();
    this.projectDir = projectDir;
    this.context = context;
    this.INIT_SETUP();
  }

  INIT_SETUP() {}

  LOAD() {}

  static loadAll() {
    this.ConfigControll.LOAD();
    this.ModelsControll.LOAD();
    this.CommandsControll.LOAD();
    this.InterfacesControll.LOAD();

    this.ScopeControll.LOAD();
    this.ScrapbookControll.LOAD();
    this.ProjectsControll.LOAD();
    this.BridgesControll.LOAD();
    this.FactorsControll.LOAD();
    this.SandboxControll.LOAD();
    this.PublicationControll.LOAD();
    this.DeploymentControll.LOAD();
  }

  static IncludeAll(projectDir, context) {
    this.CONTROLLER_CLASSES = LoadAllControllers(projectDir);
    var out = {};
    for (var controller in this.CONTROLLER_CLASSES) {
      out[controller] = new this.CONTROLLER_CLASSES[controller](
        projectDir,
        context
      );
    }
    return Object.assign(this, out);
  }
}

module.exports = BOS_Controller;
