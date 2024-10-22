const path = require("path");
//const fs = require("fs");

const BOS = require("./core/bos.js");

module.exports=function(...args){

    BOS.INITIALIZE(path.dirname(__dirname));
    BOS.SETUP({callArgs:args});
    BOS.EXECUTE({callArgs:args});
}