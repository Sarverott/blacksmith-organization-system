/*
  blacksmith-organization-system
  part of Anubis System
  Sett Sarverott 2019
*/
const {BOS, extras}=require("./main.js");
class BlacksmithSubject extends BOS{
  setup(parrent, name){
    this.parrent=parrent;
    this.name=name;
    this.history=[];
    this.files=[];
    this.watcher=null;
  }
  /*loadStorybook(data){
    var tmp=[];
    for(var i in data){
      var tmptmp=new Fileitem(data[i].path);
      tmptmp.checksum=data[i].checksum;
      tmp.push(tmptmp);
    }
    return tmp;
  }
  checkAgreement(data){
    var tmp1=this.loadStorybook(data);
    var tmp2=this.scanFiles();
    for(var i in tmp1){
      for(var i in tmp1){

      }
    }
  }
  scanFiles(){
    var tmp=getFilelist(this.getPath());
    var tmpFiles=[]
    for(var i in tmp){
      var tmptmp=new Fileitem(tmp[i]);
      tmptmp.getChecksum();
      tmpFiles.push(tmptmp);
    }
    return tmpFiles;
  }*/

  open(){
    this.reactToEvent("open");
    if(this.isOpened()){

      return false;
    }else{

    }
    //if(this.watcher==null){
    //  var tmpThis=this;
    //  this.watcher=addChangeListener(this.getPath(), function(eventType, filename){
    //    tmpThis.onChange(eventType, filename);
    //  });
    //}
    //this.onOpen();
  }
  onOpen(success){

  }
  onChange(){

  }
  close(){
    this.reactToEvent("close");
    if(this.watcher!=null){
      this.watcher.close();
      this.watcher=null;
    }
  }
  createItemDir(){
    fs.mkdirSync(this.getPath(), {recursive:true});
  }
  getPath(){
    if(this.parrent instanceof BOS.Workshop){
      return extras.joinPath(
        this.getWorkshop().path,
        this.name
      );
    }else{
      return path.join(
        this.getWorkshop().path,
        this.getSuperproject().name,
        this.name
      );
    }
  }
  getWorkshop(){
    if(this.parrent instanceof BOS.Workshop){
      return this.parrent;
    }else{
      return this.parrent.parrent;
    }
  }
  getSuperproject(){
    if(this.parrent instanceof BOS.Workshop){
      return this;
    }else{
      return this.parrent;
    }
  }
}
module.exports=BlacksmithSubject;
