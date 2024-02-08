const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

const { mongoInit } = require("./data/mongoinit");

const UserAPI = require("./routes/UserAPI");
const GMAPI = require("./routes/GMAPI");
const DMAPI = require("./routes/DMAPI");

const { gmActions } = require("./data/GMSchema");
const { dmActions } = require("./data/DMSchema");

const users = new Map();

const main = async () => {
    const db = await mongoInit();
    if (!db) {
        console.error("Error connecting to MongoDB");
        process.exit(1);
    }

    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use("/api/user", UserAPI);
    app.use("/api/gm", GMAPI);
    app.use("/api/dm", DMAPI);

    app.get("/", (_req, res) => {
        res.send("Welcome to the API");
    });

    io.on("connection", (socket) => {
        console.log(
            ">>> A user connected from",
            socket.client.conn.remoteAddress
        );
        // users.set(socket.id, { id: socket.id, socket });

        socket.on("message", async (info) => {
            console.log("Received message:", info);
            const type = info.type;
            const action = info.action;

            switch (type) {
                case "group":
                    return io.emit(
                        "message",
                        await gmActions({
                            action,
                            data: {
                                from_user: info.username,
                                room: info.receiver,
                                message: info.message,
                                date_sent: new Date(),
                            },
                        })
                    );

                case "direct":
                    return io.emit(
                        "message",
                        await dmActions({
                            action,
                            data: {
                                from_user: info.username,
                                to_user: info.receiver,
                                message: info.message,
                                date_sent: new Date(),
                            },
                        })
                    );
            }
        });

        socket.on("client_ack", (user_id) => {
            console.log("Client acknoledged:", user_id);
            users.set(user_id, { socket });
        });

        socket.on("typing", (user_id, status) => {
            console.log("user:", user_id, " -> is typing:", status);
            if (users.has(user_id))
                users.set(user_id, {
                    ...users.get(user_id),
                    typing: status,
                });
        });

        socket.on("disconnect", (user_id) => {
            console.log("user:", user_id, "disconnected");
            users.delete(user_id);
        });
    });

    const port = 5000;
    server.listen(port, () => {
        console.log(`Socket server running on port ${port}`);
    });
};

main();
