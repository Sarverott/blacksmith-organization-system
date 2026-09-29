const fs = require('fs');

const BOS = require('blacksmith-organization-system/core/bos.js');

// port of shell-procedures/deploy-new-workshop.sh
function command(){
  var created=BOS.CONTROLLERS.ScopeControll.ENSURE_TREE();
  var logPath=BOS.WorkshopPath("bos-workshop.log");
  if(!fs.existsSync(logPath)){
    fs.writeFileSync(logPath, [
      "HELLO_WORLD= new BlacksmithOrganisationSystem Workshop created",
      `CREATE_TIME=${new Date().toISOString()}`,
      `CREATE_BASE=${BOS.BOS_ROOT_PATH}`,
      ""
    ].join("\n"));
  }
  for(var createdPath of created)console.log("created:", createdPath);
  console.log(`workshop ready: ${BOS.WORKSHOP_ROOT} (${created.length} created)`);
}
module.exports=command;
