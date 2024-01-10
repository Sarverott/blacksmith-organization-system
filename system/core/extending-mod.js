
//const transform=require('carnival-toolbox').caseX.transform;

class BOS_Controller{};
class BOS_Interface{};
class BOS_Bridge{};

const EXTENDER={
  loadExt(...pathChain){
    pathChain.push(`${pathChain.pop()}.js`);
    //console.log(this);
    Object.assign(
      this,
      require(
        this.PathTo(...pathChain)
      )
    );
  },
  loadController(name){
    this.loadExt("system", "core", name);
  },

  loadInterface(name){
    //this.loadExt("system", "interfaces", name)
    return require(
      this.PathTo(
        "system",
        "interfaces",
        `${name}-interface.js`
      )
    )
  },
  loadBridge(name){
    this.loadExt("system", "bridge", name)
  },
  form:{
    Controller:BOS_Controller,
    Interface:BOS_Interface,
    Bridge:BOS_Bridge
  }
}

module.exports=function(BOS){
  Object.assign(BOS, EXTENDER)
  return BOS;
}
