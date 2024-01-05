const readline = require('readline');

module.exports=function(BOS){
  return {
    START_CLI_INTERFACE(){
      BOS.CliHook=readline.createInterface({process.stdin, process.stdout});
      BOS.CLI_WELLCOME();
    },
    CLI_PRINT_INTERFACE(name){
      console.log(BOS.fs.readFileSync("./resources/cli-scree"));
    }
    CLI_WELLCOME(){

      rl.question('What do you think of Node.js? ', (answer) => {
        // TODO: Log the answer in a database
        console.log(`Thank you for your valuable feedback: ${answer}`);

        rl.close();
      });
    }
  }
}
