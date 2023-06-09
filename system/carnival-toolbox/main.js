
class CarnivalToolbox{
  constructor(list){
    for(var i of list){
      Object.assign(this, require(`./${i}/main.js`));
    }
  }
}
module.exports=new CarnivalToolbox(['string-gadgets']);
