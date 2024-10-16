//module.exports=
//  (BOS) => class ConfigControll extends BOS.form.Controller
//  {
//
//  }

const os = require('os');
const path = require('path');

const DEFAULT_CONFIG={
  workshopPath:path.join(
    os.homedir(),
    ".__WORKSHOP"
  ),
  workshopName:"the-thought-forest",
  host:os.hostname(),//setternet
  user:os.userInfo().username,
  basicShell:os.userInfo().shell,
  instanceRole:["cli","server","desktop","webapp","command"][0],
  encryptArchive:false,
  autobackups:false,
  autocommit:false,
  monitPushingSuggestions:false,
  autoversioning:false,
  branchPerHost:false,
  publishAuth:{
    //gitConfigs:[],
    //npmConfigs:[],
    //ftpCreds...
  },
  logger:{

  },
  workTree:{

  },
  setternet:{

  }
}

const CONFIG_CONTROLL={
  SETUP:{
  }
}

module.exports=CONFIG_CONTROLL;
//  (BOS) => class RaportControll extends BOS.form.Controller
//  {

//  }
