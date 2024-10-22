const fs = require("fs");
const path = require("path");
//const vm = require("vm");
//const EventEmitter = require("events");

const Controller = require("../core/bos.controller.js");

const BOS_Command = require("../core/bos.command.js")

//var currentContextPath = null;



function LoadAllCommands(projectDir, context) {
  BOS_Command.context = context;
  const commands = {};
  const commandsList = fs
    .readdirSync(path.join(projectDir, "src", "commands"), {
      withFileTypes: true,
    })
    .filter((commandDir) => commandDir.isDirectory())
    .map((commandDir) => commandDir.name);

  for (var commandname of commandsList) {
    commands[commandname] = new BOS_Command(projectDir, commandname);
  }
  return commands;
}

class CommandsControll extends Controller {
  static get BOS_Command() {
    return BOS_Command;
  }
  static RUN_BOS_SCRIPT(startupScript, context, hook) {
    var scriptCode = fs.readFileSync(startupScript, { encoding: "utf-8" });
    scriptCode = scriptCode
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line)
      .map(
        (line) => line.split(" ").filter((line) => line)
      );
      //console.log(context.COMMANDS)
    for(var line of scriptCode){
      //console.log(line)
      context.COMMANDS[line[0]].CALL(line.slice(1), this, hook);
    }
  }
  LOAD() {
    this.context.COMMANDS = LoadAllCommands(this.projectDir, this.context);
    this.context.EVENTS.on("run-startup-script", (startupScript, context) => {
      CommandsControll.RUN_BOS_SCRIPT(startupScript, context, this);
    });
    CommandsControll.COMMANDS = this.context.COMMANDS;
  }
}

module.exports = CommandsControll;
