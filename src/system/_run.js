const path = require("path");
const fs = require("fs");

const BOS = require("./core/main.js");

//const invokingChain = process.argv.slice(1).filter((str) => str != __filename);
//console.log(process.argv);

//if (fs.existsSync(path.join(__dirname, `invoke-${invokingChain[0]}.js`))) {
  //require(path.join(__dirname, `invoke-${invokingChain[0]}.js`))(
  //  invokingChain.slice(1)
  //);
//} else {
//  console.error("UNKNOWN METHOD: ", invokingChain[0]);
  //console.log("full command argumenting chain: ", invokingChain);
  //console.log("full command: ", process.argv);


module.exports=function(...args){
    //console.log()
    BOS.INITIALIZE;
    BOS.LOAD;
}