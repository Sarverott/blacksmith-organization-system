//const {BOS}=require("./main.js");
const events=require("events");

class BOSlistener extends events.EventEmitter{};

module.exports=function(){return new BOSlistener();}
