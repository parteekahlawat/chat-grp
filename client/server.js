const { createServer } = require("http");
const { Server } = require("socket.io");
const next = require('next')
// console.log(process.env)
const dev = process.env.NEXT_PUBLIC_NODE_ENV !== "production";
const port = process.env.NEXT_PUBLIC_PORT || 4000;

const hostname = process.env.NEXT_PUBLIC_HOSTNAME || 'localhost';
const app = next({ dev, hostname, port});
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Connection made successfully!");

    socket.on("sent-message", (message, user) => {
      console.log("Received message on server side: ", message);
      console.log("Received username on server side:", user);
      io.emit("all-message", message)
    });
    socket.on("sent-username", (user, msg)=>{
      console.log("Received username on server side:", user," and ", msg);
      io.emit("rec-username", user)
    })
  });

  httpServer.once("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}).catch(err => {
  console.error('Next.js app preparation failed:', err);
  process.exit(1);
});
