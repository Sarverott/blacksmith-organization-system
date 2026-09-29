const os = require('os');
const child_process = require('child_process');

const BOS = require('blacksmith-organization-system/core/bos.js');

// port of toolsets bos_component_create.sh + submodule_bos.sh
function command(name){
  if(!name||!/^[a-z0-9_-]+$/.test(name))throw new Error("usage: new-component <name>");
  var owner=process.env.BOS_GITHUB_OWNER||os.userInfo().username;
  var run=(cmd, args)=>child_process.execFileSync(cmd, args, {stdio:"inherit", cwd:BOS.BOS_ROOT_PATH});
  run("gh", ["repo", "create", `bos.${name}`, "--include-all-branches", "--public", `--template=${owner}/bos_component_template`]);
  run("git", ["submodule", "add", `https://github.com/${owner}/bos.${name}.git`, `src/components/${name}`]);
  console.log(`component bos.${name} created and added at src/components/${name}`);
}
module.exports=command;
