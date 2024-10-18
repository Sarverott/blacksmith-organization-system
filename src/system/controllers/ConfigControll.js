const fs = require("fs");
const path = require("path");

const Controller = require("../core/controller.js");

function loadAllConfigs(){

}


class ConfigControll extends Controller{
    LOAD(){
      this.context.MODELS=loadAllConfigs(this);
    }
}

module.exports = ConfigControll;