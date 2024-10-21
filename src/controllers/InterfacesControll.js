const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");

const Controller = require("../core/bos.controller.js");

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

class BOS_Interface  {
  constructor(initAction, context) {
    this.active=false;
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
