const fs = require("fs");
const path = require("path");

const Controller = require("../core/controller.js");

function loadAllInterfaces(){
    
}


class InterfacesControll extends Controller{
    LOAD(){
      //this.context.MODELS=loadAllConfigs(this);
    }
}

module.exports = InterfacesControll;