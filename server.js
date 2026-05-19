const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// Store the single "master" document state
let documentData = "";
let connectedUsers = 0;

io.on("connection", (socket) => {
    connectedUsers++;
    
    // Broadcast the updated user count to everyone
    io.emit("user-count", connectedUsers);

    // Send the current document to the newly connected user
    socket.emit("load-document", documentData);

    // Listen for delta changes from a client and broadcast to others
    socket.on("send-changes", (delta) => {
        socket.broadcast.emit("receive-changes", delta);
    });

    // Listen for full document saves to keep the server's master state up-to-date
    socket.on("save-document", (data) => {
        documentData = data;
    });

    // Broadcast cursor movements
    socket.on("cursor-move", (data) => {
        socket.broadcast.emit("receive-cursor", data);
    });

    socket.on("disconnect", () => {
        connectedUsers--;
        io.emit("user-count", connectedUsers);
        
        // Remove disconnected user's cursor
        io.emit("receive-cursor", { id: socket.id, range: null });
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});