
//const transform=require('carnival-toolbox').caseX.transform;
const fs = require('fs');
const path = require('path');
const {changeCase, capitalFirst, debug} = require('carnival-toolbox');

const EXTENDER={
  Update(updatePack, whoAmI=this){
    Object.assign(
      whoAmI,
      updatePack
    );
    return whoAmI;
  },
  HookRef(contextRef, hookName, whoAmI=this){
    Object.defineProperty(
      whoAmI,
      hookName,
      {
        get(){
          return contextRef;
        }
      }
    );
    return whoAmI;
  },
  LoadExt(...pathChain){
    pathChain.push(`${pathChain.pop()}.js`);
    //console.log(this);
    const EXT=require(
      this.PathTo(...pathChain)
    );
    this.Update(
      EXT
    );
    return Object.keys(EXT);
  },
  LoadController(name){
    debug.log("CONTROLER-LOAD:", [name]);
    this.CONTROLLERS[name]=this.LoadExt("system", "core", name);
  },
  LoadInterface(name){
    debug.log("INTERFACE-LOAD:", [name]);
    //this.loadExt("system", "interfaces", name)
    return require(
      this.PathTo(
        "system",
        "interfaces",
        `${name}`,
        `index.js`
      )
    )
  },
  LoadBridge(name){
    debug.log("BRIDGE-LOAD:", [name]);
    //this.LoadExt("system", "bridge", name)
  },
  LoadAllControllers(){
    const autolistControllers=fs.readdirSync(__dirname).filter(
      (filename)=>filename.endsWith("-controll.js")
    ).map(
      (name)=>path.basename(name, ".js")
    );
    for(var item of autolistControllers){
      this.LoadController(item);
      //console.log(item)
    }
  },
  LoadAllFactors(){
    const factoryScripts=fs.readdirSync(
      this.PathTo("system","factors"),
      {withFileTypes:true}
    ).filter(
      (item)=>item.isFile()
    ).filter(
      (item)=>item.name.endsWith("-factory.js")
    ).map(
      (item)=>item.name
    );
    //this.FACTORS={};
    //console.log(factoryScripts);
    for(var script of factoryScripts){
      debug.log("FACTOR-LOAD:", [script.split("-")[0]]);
      this.FACTORS[
        capitalFirst(script.split("-")[0])
      ]=require(this.PathTo("system","factors",script));
    }
  },
  LoadCommand(name, script){
    debug.log("COMMAND-LOAD:", [name,script]);
    this.COMMANDS[name]=require(
      this.PathTo( "system", "commands", script)
    );
  },
  LoadAllCommands(){
    const commandsScripts=fs.readdirSync(
      this.PathTo("system", "commands"),
      {withFileTypes:true}
    ).filter(
      (script)=>script.isFile()
    ).filter(
      (script)=>path.extname(script.name)==".js"
    ).map(
      (script)=>script.name
    );
    for(var script of commandsScripts){
      this.LoadCommand(
        changeCase(
          path.basename(script, ".js")
        ).from("kebabcase").to("camelcase").GO,
        script
      );
    }
  },
  
}

module.exports=function(BOS){
  EXTENDER.Update(EXTENDER, BOS);
  return BOS;
}
