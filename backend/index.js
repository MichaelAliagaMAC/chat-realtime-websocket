const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173" || "https://chat-realtime-websocket.vercel.app/",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`Usuario actual: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`Usuario con id: ${socket.id} se unió a la sala ${data}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("Usuario desconectado", socket.id);
    });
});

app.get('/', (req, res) => {
    res.send('<h1>Puerto Utilizado</h1>');
});

const port = process.env.PORT || 3000;
server.listen(port, '::', () => {
    console.log(`Server running at http://localhost:${port}`);
});

