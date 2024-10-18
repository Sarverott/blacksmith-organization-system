



function INIT_CLI_METHOD(context){
  //process.stdout.write('\u001b[s');

  this.CONTEXT=context;
  //printMenuTitle("big");
  //printMenuTitle("big-shortcut");
  //printMenuTitle("medium");
  //printMenuTitle("small");
  //INTERFACE.startscreen(true);


  //INTERFACE.LOAD_COMMAND("exit");
  //console.log(CLI.loadPTXML("minimenu-header"));

  //this.interface=new repl.REPLServer(SETUP);

  var tmpThis=this;

  var counter=0
  this.clearTerminal();
  var startSequence=setInterval(
    function(){
      if(counter++>10){
        clearInterval(startSequence);
        tmpThis.clearTerminal();
        console.log(
          tmpThis.CLI.loadPTXML("minimenu-header")
        );
        tmpThis.MAIN=readline.createInterface(
          tmpThis.SETUP
        )
        //this.terminal.on("line", this.LOOP)
        //this.terminal.on("close", this.EXITING);
        tmpThis.MAIN.prompt();
      }else{
        tmpThis.startscreen()
      }
    },
    100
  );
}

module.exports=INIT_CLI_METHOD
