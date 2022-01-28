/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/

const HOSTNAME="setternet-C1";

const EventEmitter = require('events');
const fs=require("fs");
const path=require("path");
var BOS=null;//just another shorter alias

class BlacksmithOrganizationSystem{
  constructor(...args){
    this.id=BOS.REGIST(...(
      (BOS.MODE=="insert")
      ?
      [this, args.shift()]
      :
      [this]
    ));
    this.emitter=new EventEmitter();
    this.beforeConstruct(...args);
    this.setup(...args);
    this.afterConstruct(...args);
  }
  setup(){}
  beforeConstruct(){}
  afterConstruct(){}
  static SAFE_CREATE_DIR(path){
    fs.mkdirSync(path,{recursive:true})
  }
  static WRITE_OUTPUT_FILE(filepath, output, readable=false){
    fs.writeFileSync(
      filepath,
      JSON.stringify(
        ...((readable)?[output, null, '\t']:[output])
      )
    );
  }
  static READ_INPUT_FILE(filepath){
    return JSON.parse(fs.readFileSync(
      filepath
    ));
  }
  /*
  getRaport(){
    return {
      id:this.id
    };
  }
  */

  static get Workshop(){return require("./workshop.js");}
  static get Throwbox(){return require("./throwbox.js");}
  static get Forge(){return require("./forge.js");}
  static get Project(){return require("./project.js");}
  static get Sacrophag(){return require("./sacrophag.js");}
  static get Sheme(){return require("./sheme.js");}
  static get Archive(){return require("./archive.js");}
  static get Subject(){return require("./subject.js");}
  static get Superproject(){return require("./superproject.js");}


  static SAFE_INIT(){
    if(typeof BOS.allIDs==='undefined')BOS.allIDs={};
    if(typeof BOS.counters==='undefined')BOS.counters={};
  }
  static get ALL(){
    BOS.SAFE_INIT();
    return BOS.allIDs;
  }
  static GET_ID(id){
    return BOS.ALL[id];
  }
  static LIST_ID(){
    return Object.keys(BOS.ALL);
  }
  static SET_APPEND_MODE(){
    BOS.idAddressingMode="append";
  }
  static SET_INSERT_MODE(){
    BOS.idAddressingMode="insert";
  }
  static get MODE(){
    if(typeof BOS.idAddressingMode==='undefined')BOS.SET_APPEND_MODE();
    return BOS.idAddressingMode;
  }
  static REGIST(item, id=null){
    BOS.SAFE_INIT();
    var objectType=item.constructor.name.substring(10).toLowerCase();
    var tmpId=id;
    if(BOS.MODE=="append"){
      if(BOS.counters.hasOwnProperty(objectType))++BOS.counters[objectType];
      else BOS.counters[objectType]=0;
      tmpId=`${HOSTNAME}-${objectType}-${BOS.counters[objectType]}`;
    }else if(BOS.MODE=="insert"){
      var idData=id.split("-");
      if(BOS.counters.hasOwnProperty(idData[2])){
        if(parseInt(idData[3])>BOS.counters[idData[2]])
          BOS.counters[idData[2]]=parseInt(idData[3]);
      }else{
        BOS.counters[objectType]=parseInt(idData[3]);
      }
    }
    BOS.allIDs[tmpId]=item;
    return tmpId;
  }
  static SAVE_DIRTREE(dirpath, readable=false){
    var output=BOS.SAVE();
    output.savemode="dirtree";
    BOS.SAFE_CREATE_DIR(dirpath);
    for(var i in output.items){
      BOS.SAFE_CREATE_DIR(path.join(dirpath, i));
      BOS.WRITE_OUTPUT_FILE(
        path.join(dirpath, i, "_bos-item-data.json"),
        output.items[i],
        readable
      );
    }
    output.items=Object.keys(output.items);
    BOS.WRITE_OUTPUT_FILE(
      path.join(dirpath, "_bos-general-record.json"),
      output,
      readable
    );
  }
  static SAVE_DIR(dirpath, readable=false){
    var output=BOS.SAVE();
    output.savemode="onedir";
    BOS.SAFE_CREATE_DIR(dirpath);
    for(var i in output.items){
      BOS.WRITE_OUTPUT_FILE(
        path.join(dirpath, i+".json"),
        output.items[i],
        readable
      );
    }
    output.items=Object.keys(output.items);
    BOS.WRITE_OUTPUT_FILE(
      path.join(dirpath, "_bos-general-record.json"),
      output,
      readable
    );
  }
  static SAVE_FILE(filepath, readable=false){
    var output=BOS.SAVE();
    output.savemode="onefile";
    BOS.WRITE_OUTPUT_FILE(
      path.join(filepath),
      output,
      readable
    );
  }
  static SAVE(){
    BOS.SAFE_INIT();
    var output={
      savemode:"none",
      items:{},
      hostname:HOSTNAME,
      enviroment:null
    };
    for(var i in BOS.allIDs){
      output.items[i]=BOS.writeRaport(BOS.allIDs[i]);
    }
    return output;
  }
  static LOAD_FILE(filepath){

  }
  static LOAD(input){
    BOS.SET_INSERT_MODE();

    BOS.SET_APPEND_MODE();
  }
  static writeRaport(bosItem){
    if(bosItem instanceof BOS.Workshop){
      return {
        label:bosItem.label,
        forges:bosItem.items.forges.map(function(subject){
          return subject.id
        }),
        archives:bosItem.items.archives.map(function(subject){
          return subject.id
        })
      }
    }else if(bosItem instanceof BOS.Forge){
      return {
        path:bosItem.dirpath,
        name:bosItem.name,
        contains:bosItem.subjects.map(function(subject){
          return subject.id
        })
      };
    }else if(bosItem instanceof BOS.Archive){
      return {
        path:bosItem.dirpath,
        name:bosItem.name
        //contains:bosItem.subjects.map(function(subject){
        //  return subject.id
        //})
      };
    }else if(bosItem instanceof BOS.Superproject){
      return {
        path:bosItem.dirpath,
        name:bosItem.name,
        status:bosItem.content.status,
        includes:bosItem.subjects.map(function(subject){
          return subject.id
        }),
        throwboxes:bosItem.throwbox.map(function(subject){
          return subject.id
        })
      };
    }else if(bosItem instanceof BOS.Sheme){
      return {
        path:bosItem.dirpath,
        name:bosItem.name,
        status:bosItem.content.status,
        files:bosItem.content.files
      };
    }else if(bosItem instanceof BOS.Project){
      return {
        path:bosItem.dirpath,
        name:bosItem.name,
        status:bosItem.content.status,
        files:bosItem.content.files
      };
    }else if(bosItem instanceof BOS.Throwbox){
      return {
        path:bosItem.dirpath,
        name:bosItem.name,
        status:bosItem.content.status,
        files:bosItem.content.files
      };
    }else if(bosItem instanceof BOS.Sarcophag){
      return {
        path:bosItem.dirpath,
        name:bosItem.name
        //status:bosItem.content.status,
        //files:bosItem.content.files
      };
    }else{
      console.error(bosItem);
      return null;
    }
  }
};

BOS=BlacksmithOrganizationSystem;

module.exports={
  BOS
  //HOSTNAME
};
