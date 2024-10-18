const fs = require("fs");
const path = require("path");

function LoadAllControllers(projectDir) {
  var controllers = {};
  var controllerList = fs
    .readdirSync(path.join(projectDir, "system", "controllers"), {
      withFileTypes: true,
    })
    .filter((item) => item.isFile())
    .map((item) => item.name);

  for (var controll of controllerList) {
    controllers[path.basename(controll, ".js")] = require(path.join(
      projectDir,
      "system",
      "controllers",
      controll
    ));
  }
  return controllers;
}

class BOS_Controller extends EventEmitter{
  constructor(projectDir, context) {
    this.projectDir = projectDir;
    this.context = context;
    this.INIT_SETUP();
  }

  INIT_SETUP() {}

  LOAD() {}

  static IncludeAll(projectDir, context) {
    this.CONTROLLER_CLASSES = LoadAllControllers(projectDir);
    var out = {};
    for (var controller in this.CONTROLLER_CLASSES) {
      out[controller] = new this.CONTROLLER_CLASSES[controller](
        projectDir,
        context
      );
    }
    return out;
  }
}

module.exports = BOS_Controller;
