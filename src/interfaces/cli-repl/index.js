const readline = require('readline');
const repl = require('repl');
const fs = require('fs');
const path = require('path');


const {CliTool} = require('carnival-toolbox');

const {BOS}=require("../../core/bos.js");



//Version: 0.2.0 (PreAlfa_#1)

const CLI=new CliTool(
  {
    textarts:BOS.PathTo("system", "resources", "textarts"),
    ptxmls:BOS.PathTo("system", "resources", "textarts")
  }
);

console.log(BOS.FACTORS);

const INTERFACE=new BOS.FACTORS.Interface(
  "cli",
  {
    CLI,
    loadHeader(label, margins={top:2, left:20}){
      return CLI.LOAD_HEAD(
        label
      ).paint(
        "random",
        "FRONT",
        [ "red" , "yellow" ]
      ).shades(
        CLI.dim,
        CLI.paintIt(CLI.FRONT.white)
      ).margins(
        margins
      ).PRINT;
    },
    clearTerminal(){
      //readline.cursor(process.stdout,0,0);
      //CLI.paintIt(CLI.FRONT.black);
      const [width, height]=process.stdout.getWindowSize();
      for(var y=0;y<height;y++){
        CLI.colorPrint(Array(width).fill("#").join(""), CLI.FRONT.black);
      }
      //CLI.paintIt(CLI.reset);
      readline.moveCursor(process.stdout,-width,-height);
    },
    startscreen(preventCursorReroll=false){
      readline.cursorTo(process.stdout,0,0);
      var LOGO=this.loadHeader("big");
      LOGO+="\n\t\t\t\t";
      LOGO+=CLI.colorize(
        "Copyright (c) 2019 Sett Sarverott, released on terms of MIT license",
        [CLI.bright,CLI.reset]
      );
      LOGO+="\n";
      var HEIGHT=LOGO.replaceAll("/n","").length-LOGO.length;
      //return {LOGO,HEIGHT};
      console.log(LOGO);
      readline.moveCursor(process.stdout,0,HEIGHT)
    },
    endscreen(preventCursorReroll=false){
      readline.cursorTo(process.stdout,0,0);
      console.log("\n\t\t\tSEE YOU NEXT TIME!")
      var LOGO=this.loadHeader("small",{top:0,left:6});
      LOGO+="\n   ";
      LOGO+=CLI.colorize(
        "Copyright (c) 2019 Sett Sarverott, released on terms of MIT license",
        [CLI.bright,CLI.reset]
      );
      var HEIGHT=LOGO.replaceAll("/n","").length-LOGO.length;
      //return {LOGO,HEIGHT};
      console.log(LOGO);
      CLI.colorPrint("   GitHub: https://github.com/Sarverott/blacksmith-organization-system\n", CLI.FRONT.yellow)
      //readline.moveCursor(process.stdout,0,HEIGHT)
    }
  }
);

//INTERFACE.=;

//function printMenuTitle(title){
//  console.log();
//}
//function START_MINIMENU(){

//}

module.exports={
  INTERFACE,
  CLI
};
