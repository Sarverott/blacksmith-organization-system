const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const BOS = require('blacksmith-organization-system/core/bos.js');

// port of shell-procedures/new-superproject.sh (scopes were called superprojects)
function command(name){
  if(!name||name.includes("/")||name.startsWith("."))throw new Error("usage: new-scope <name>");
  var scopePath=BOS.WorkshopPath("forge", name);
  if(fs.existsSync(scopePath))throw new Error(`scope already exists: ${scopePath}`);
  fs.mkdirSync(scopePath, {recursive:true});
  child_process.execFileSync("git", ["init", "--quiet", scopePath], {stdio:"inherit"});
  console.log("scope created:", scopePath);
}
module.exports=command;
