const path = require("path");
const fs = require("fs");

const BOS = require("./core/main.js");

module.exports=function(...args){

    BOS.INITIALIZE;
    BOS.LOAD;
}