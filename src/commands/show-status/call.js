const fs = require('fs');
const path = require('path');

const BOS = require('blacksmith-organization-system/core/bos.js');
const helpers = require('blacksmith-organization-system/core/helperFunctions.js');

function listDir(dirpath){
  if(!fs.existsSync(dirpath))return console.log("  (missing)", dirpath);
  var entries=fs.readdirSync(dirpath, {withFileTypes:true}).filter((entry)=>entry.isDirectory());
  if(!entries.length)console.log("  (empty)");
  for(var entry of entries)console.log("  "+entry.name);
}

function command(...args){
  var subject=args[0]||"workshop";
  if(subject=="workshop"){
    console.log("workshop:", BOS.WORKSHOP_ROOT);
    for(var area in BOS.CONFIG.workshop.content){
      var [areaType]=BOS.CONFIG.workshop.content[area];
      var state=fs.existsSync(BOS.WorkshopPath(area))?"ok":"MISSING";
      console.log(`  ${area.padEnd(14)} ${areaType.padEnd(10)} ${state}`);
    }
  }else if(subject=="workshops"){
    for(var workshopPath of helpers.listWorkshops()){
      console.log((workshopPath==BOS.WORKSHOP_ROOT?"* ":"  ")+workshopPath);
    }
  }else if(subject=="forge"||subject=="archive"){
    console.log(subject+":");
    listDir(BOS.WorkshopPath(subject));
  }else if(subject=="interfaces"){
    for(var name in BOS.INTERFACES){
      console.log(`  ${name} ${BOS.INTERFACES[name].active?"active":"inactive"}`);
    }
  }else if(subject=="tree"){
    console.log(BOS.SCOPE_ROOT);
  }else{
    console.error(`ERROR: unknown status subject "${subject}"`);
  }
}
module.exports=command;
