const child_process = require("child_process");
const electron = require("electron");
const path = require("path");

const GUI_PROCESS = child_process.execFile(
  electron,
  [path.join(__dirname, "main.js")],
  (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    console.log(stderr);
    console.log(stdout);
  }
);
console.log(GUI_PROCESS);

GUI_PROCESS.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

GUI_PROCESS.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

GUI_PROCESS.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});
