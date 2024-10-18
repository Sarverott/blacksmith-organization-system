const fs = require("fs");
const path = require("path");
const vm = require("vm");
const EventEmitter = require("events");

const Controller = require("../core/controller.js");

//var currentContextPath = null;

class BOS_Command {
  constructor(projectDir, command) {
    this.context = this.constructor.context;
    this.name = command;
    this.indexData = JSON.parse(
      fs.readFileSync(
        path.join(projectDir, "system", "commands", command, "index.json"),
        { encoding: "utf-8" }
      )
    );
    this.manual = fs.readFileSync(
      path.join(projectDir, "system", "commands", command, "manual.md"),
      { encoding: "utf-8" }
    );
    this.action = require(path.join(
      projectDir,
      "system",
      "commands",
      command,
      "call.js"
    ));
    //return {indexData, manual, action};
    //debug.log("COMMAND-LOAD:", [name, script]);
    //this.COMMANDS[name] = require(this.PathTo("system", "commands", script));
  }
  CALL(args, execHook, interfaceHook) {
    this.execHook = execHook;
    this.interfaceHook = interfaceHook;
    return this.action(...args);
  }
  //static INITIALIZE(context){
  //    this.context
  //}
}

function LoadAllCommands(projectDir, context) {
  BOS_Command.context = context;
  const commands = {};
  const commandsList = fs
    .readdirSync(path.join(projectDir, "system", "commands"), {
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
    for(var line of scriptCode){
      context.COMMANDS[line[0]](line.slice(1), this, hook)
    }
  }
  LOAD() {
    this.context.COMMANDS = LoadAllCommands(this.projectDir, this.context);
    this.context.on("run-startup-script", (startupScript, context) => {
      CommandsControll.RUN_BOS_SCRIPT(startupScript, context, this);
    });
    CommandsControll.COMMANDS = this.context.COMMANDS;
  }
}

module.exports = CommandsControll;
