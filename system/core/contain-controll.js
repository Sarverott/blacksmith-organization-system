//module.exports=
//  (BOS) => class ContainControll extends BOS.form.Controller
//  {
//
//  }

const fs = require('fs');
const path = require('path');
const os = require('os');
const {loadJSON, changeCase, capitalFirst} = require('carnival-toolbox');

const CONTAIN_CONTROLL={

  IsWorkshopDeployed(){
    return fs.existsSync(
      path.join(
        os.homedir(),
        ".__WORKSHOP"
      )
    );
  }
}

module.exports=CONTAIN_CONTROLL;
//  (BOS) => class RaportControll extends BOS.form.Controller
//  {

//  }
