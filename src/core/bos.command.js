const fs = require("fs");
const path = require("path");



class BOS_Command {
    constructor(projectDir, command) {
      this.context = this.constructor.context;
      this.name = command;
      this.indexData = JSON.parse(
        fs.readFileSync(
          path.join(projectDir, "src", "commands", command, "index.json"),
          { encoding: "utf-8" }
        )
      );
      this.manual = fs.readFileSync(
        path.join(projectDir, "src", "commands", command, "manual.md"),
        { encoding: "utf-8" }
      );
      this.action = require(path.join(
        projectDir,
        "src",
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

  module.exports = BOS_Command;