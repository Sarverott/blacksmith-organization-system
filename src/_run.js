const path = require("path");
const fs = require("fs");

const BOS = require("./core/bos.class.js");

module.exports=function(...args){

    BOS.INITIALIZE;
    BOS.LOAD;
}