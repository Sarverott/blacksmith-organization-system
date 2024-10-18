const fs = require("fs");
const path = require("path");
const vm = require("vm");
const EventEmitter = require("events");

const Controller = require("../core/controller.js")

//var currentContextPath = null;

class BOS_Command {
  constructor(projectDir, command) {
    this.context=this.constructor.context;
    this.name=command;
    this.indexData = JSON.parse(
      fs.readFileSync(
        path.join(projectDir, "system", "commands", command, "index.json"),
        {encoding: "utf-8"}
      )
    );
    this.manual = fs.readFileSync(
      path.join(projectDir, "system", "commands", command, "manual.md"),
      {encoding: "utf-8"}
    );
    this.action = require(
      path.join(projectDir, "system", "commands", command, "call.js")
    );
    //return {indexData, manual, action};
    //debug.log("COMMAND-LOAD:", [name, script]);
    //this.COMMANDS[name] = require(this.PathTo("system", "commands", script));
  }
  CALL(...args){
    return this.action(...args);
  }
  //static INITIALIZE(context){
  //    this.context
  //}
}

function LoadAllCommands(projectDir, context) {
  BOS_Command.context=context;
  const commands={};
  const commandsList = fs
    .readdirSync(path.join(projectDir, "system", "commands"), {
      withFileTypes: true,
    })
    .filter((commandDir) => commandDir.isDirectory())
    .map((commandDir) => commandDir.name);

  for (var commandname of commandsList) {
    commands[commandname] = new BOS_Command( projectDir, commandname);
  }
  return commands;
}



class CommandsControll extends Controller{
  static get BOS_Command(){
    return BOS_Command;
  }
  LOAD(){
    this.context.COMMANDS = LoadAllCommands(
      this.projectDir,
      this.context
    );
  }
}

module.exports = CommandsControll;
