const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const BOS = require('blacksmith-organization-system/core/bos.js');

function repoDirName(repoUrl){
  return path.basename(repoUrl.replace(/\/+$/, "")).replace(/\.git$/, "");
}

// port of toolsets archive_mirrors.sh:
// each .DATA/<pack>.gitlist holds one repo url per line, cloned into archive/<pack>/
function command(){
  var dataPath=BOS.WorkshopPath(".DATA");
  var gitlists=fs.existsSync(dataPath)?fs.readdirSync(dataPath).filter((name)=>name.endsWith(".gitlist")):[];
  if(!gitlists.length)return console.log(`no *.gitlist files in ${dataPath}`);
  for(var gitlist of gitlists){
    var packPath=BOS.WorkshopPath("archive", path.basename(gitlist, ".gitlist"));
    fs.mkdirSync(packPath, {recursive:true});
    console.log(`open gitlist ${gitlist}`);
    var repos=fs.readFileSync(path.join(dataPath, gitlist), "utf-8")
      .split("\n").map((line)=>line.trim()).filter((line)=>line&&!line.startsWith("#"));
    for(var repo of repos){
      var repoPath=path.join(packPath, repoDirName(repo));
      try{
        if(fs.existsSync(repoPath)){
          console.log(`\tfetch ${repo}`);
          child_process.execFileSync("git", ["-C", repoPath, "fetch", "--all", "--quiet"], {stdio:"inherit"});
        }else{
          console.log(`\tclone ${repo}`);
          child_process.execFileSync("git", ["clone", "--quiet", repo, repoPath], {stdio:"inherit"});
        }
      }catch(e){
        console.error(`\tFAILED ${repo}: ${e.message}`);
      }
    }
    console.log(`close gitlist ${gitlist}`);
  }
}
module.exports=command;
