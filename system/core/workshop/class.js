/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/


module.exports=function(BOS){
  return class BlacksmithWorkshop extends BOS{
    initializationOfObject(initOpts){
      this.archive=new BOS.Archive(
        `${this.name}-archive`,
        BOS.FROM_ROOTDIR("archive")
      );
      this.forge=new BOS.Forge(
        `${this.name}-forge`,
        BOS.FROM_ROOTDIR("forge")
      );
    }
    loadConfiguration(){

    }
    eventListenersSetup(){

    }

  };


}
