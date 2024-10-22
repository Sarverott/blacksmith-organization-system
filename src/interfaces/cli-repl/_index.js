//const readline = require("readline");
const repl = require("repl");
//const fs = require("fs");
//const path = require("path");
//const vm = require("vm")
const process = require("process");

const BOS = require("../../core/bos.js");

function INIT() {
  this.active=true;
  this.config = Object.assign(
    { input: process.stdin, output: process.stdout },
    this.context.CONFIG.main.interfaces.cli
  );
  this.hook = repl.start(this.config);
  this.hook.context.BOS = BOS;
  this.hook.setupHistory(this.config.historyPath, HISTORY);
  for (var command in this.context.COMMANDS) {
    addCommand(this.hook, command, this.context.COMMANDS[command], this.context);
  }
  return this.hook;
}
function HISTORY() {}

function addCommand(cliHook, commandname, commandItem) {
  cliHook.defineCommand(commandname, {
    help: commandItem.indexData.help,
    action(...args) {
      commandItem.CALL(args, this, cliHook);
      //this.clearBufferedCommand();
      //console.log(`Hello, ${name}!`);
      //this.displayPrompt();
    },
  });
}

module.exports=INIT;