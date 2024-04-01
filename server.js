const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Connection made successfully!");

    socket.on("message", (message) => {
      console.log("Received message:", message, `from ${socket.id}`);
      io.emit("all-message", message)
      io.emit("all-message-id", socket.id)
    });
  });

  httpServer.once("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });

  httpServer.listen(port, () => {
    console.log(`Server listening on http://${hostname}:${port}`);
  });
}).catch(err => {
  console.error('Next.js app preparation failed:', err);
  process.exit(1);
});
