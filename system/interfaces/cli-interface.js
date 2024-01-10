const readline = require('readline');
const repl = require('repl');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const {CliTool} = require('carnival-toolbox');

//const {BOS}=require("../core/main.js");

//Version: 0.2.0 (PreAlfa_#1)

const CLI = new CliTool(
  {
    textarts:path.join(
      __dirname,
      "..",
      "resources",
      "textarts"
    ),
    ptxmls:path.join(
      __dirname,
      "..",
      "resources",
      "textarts"
    )
  }
)



const INTERFACE = {
  interface:null,
  INIT(BOS){

    //printMenuTitle("big");
    //printMenuTitle("big-shortcut");
    //printMenuTitle("medium");
    //printMenuTitle("small");
    console.log(CLI.loadPTXML("minimenu-header"));

    //this.interface=new repl.REPLServer(SETUP);

    this.interface=readline.createInterface(SETUP).on("line", this.LOOP).on("close", ()=>console.log("DUPA"));
    INTERFACE.interface.prompt();
  },
  SETUP_EVENT(eventname){
    const listenerScript=require(`./cli.on-${eventname}.js`);
    listenerScript.INTERFACE=INTERFACE;
    listenerScript.CLI=CLI;
    this.interface.on(eventname, listenerScript.ON_EVENT);
  },
  SETUP_COMMAND(command){
    const commandScript=require(
      BOS.PathTo("system", "commands", command, "index.js")
    );
    commandScript.INTERFACE=this;
    commandScript.CLI=CLI;
    this.interface.defineCommand(command, commandScript.EXEC);
  },
  LOOP(line){
    const inputScript = new vm.Script(line);
    const supercontext={BOS}
    vm.createContext(supercontext);
    try{
      console.log(inputScript.runInContext(supercontext));
    }catch(e){
      console.log(e);
    }
    INTERFACE.interface.prompt();
  },
  prompt(line){
    //this.interface.write(line);
  },
  showPrompt(){
    //this.interface.displayPrompt();
  }
}

const SETUP={
  input: process.stdin,
  output: process.stdout,
  prompt: '\t~{ BOS }~> '
};

function printMenuTitle(title){
  console.log(HeaderTitle.load(
    "big"
  ).paint(
    "random",
    "FRONT",
    [ "red" , "yellow" ]
  ).shades(
    CLI.dim,
    CLI.paintIt(CLI.FRONT.white)
  ).margins(
    {top:2, left:20}
  ).PRINT);
}
//function START_MINIMENU(){

//}

module.exports={INTERFACE, CLI};
