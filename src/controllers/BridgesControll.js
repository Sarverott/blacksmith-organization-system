const fs = require("fs");
const path = require("path");

const Controller = require("../core/controller.js");

function loadAllBridges(){

}


class BridgesControll extends Controller{
    LOAD(){
      //this.context.MODELS=loadAllConfigs(this);
    }
}

module.exports = BridgesControll;