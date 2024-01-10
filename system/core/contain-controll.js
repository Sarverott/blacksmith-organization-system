//module.exports=
//  (BOS) => class ContainControll extends BOS.form.Controller
//  {
//
//  }

const fs = require('fs');
const path = require('path');
const os = require('os');
const {loadJSON, changeCase} = require('carnival-toolbox');

const CONTAIN_CONTROLL={

  IsWorkshopDeployed(){
    return fs.existsSync(
      path.join(
        os.homedir(),
        ".__WORKSHOP"
      )
    );
  },
  mountGetterModule(classHook, modelname){
    Object.defineProperty(
      this,
      modelname,
      {
        get(){
          return classHook;
        }
      }
    );
  },
  LoadModel(name){
    //console.log(name);
    this.TypeList[name]=require(
      this.PathTo( "system", "models", name, "class.js")
    );
    var modelname = changeCase(name).from("camelcase").to("pascalcase").GO;
    this.mountGetterModule(this.TypeList[name], modelname);
  },
  ListModelsDir(){
    return fs.readdirSync(
      this.PathTo("system", "models")
    );
  }
}

module.exports=CONTAIN_CONTROLL;
//  (BOS) => class RaportControll extends BOS.form.Controller
//  {

//  }
