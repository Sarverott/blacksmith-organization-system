const fs = require("fs");
const path = require("path");

const helpers = require("./helperFunctions.js");



class BOS_Command {
    constructor(projectDir, command) {
      this.context = this.constructor.context;
      this.name = command;
      this.indexData = JSON.parse(
        fs.readFileSync(
          helpers.componentPath(projectDir, "commands", command, "index.json"),
          { encoding: "utf-8" }
        )
      );
      this.manual = fs.readFileSync(
        helpers.componentPath(projectDir, "commands", command, "manual.md"),
        { encoding: "utf-8" }
      );
      this.action = require(
        helpers.componentPath(projectDir, "commands", command, "call.js")
      );
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

  module.exports = BOS_Command;