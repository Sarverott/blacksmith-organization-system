const fs = require("fs");
const path = require("path");

const Controller = require("../core/controller.js");

function loadAllInterfaces(controllerHook) {
  var interfaces = {};
  var interfaceList = fs
    .readdirSync(path.join(controllerHook.projectDir, "system", "interfaces"), {
      withFileTypes: true,
    })
    .filter((item) => item.isDirectory())
    .map((item) => item.name);
  for (var interfacename of interfaceList) {
    interfaces[interfacename] = new BOS_Interface(
      require(path.join(
        controllerHook.projectDir,
        "system",
        "interfaces",
        interfacename,
        "_index.js"
      )),
      controllerHook.context
    );
  }
  return interfaces;
}

class BOS_Interface {
  constructor(initAction, context) {
    this.INIT = initAction;
    this.context = context;
  }
}

class InterfacesControll extends Controller {
  LOAD() {
    this.context.INTERFACES = loadAllInterfaces(this);
    //this.context.MODELS=loadAllConfigs(this);
  }
}

module.exports = InterfacesControll;
