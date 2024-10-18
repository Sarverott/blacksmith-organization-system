const { Server } = require("socket.io");

//const httpServer = http.createServer();
const ioInterface=new Server(3000);


ioInterface.on("connection", (socket) => {
  console.log("a user connected");

  console.log(socket.id); // x8WIv7-mJelg7on_ALbx

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});