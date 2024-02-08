const express = require("express");
const bodyParser = require("body-parser");
const { mongoInit } = require("./data/mongoinit");

const UserAPI = require("./routes/UserAPI");
const GMAPI = require("./routes/GMAPI");
const DMAPI = require("./routes/DMAPI");

const port = 4000;

const main = async () => {
    const db = await mongoInit();
    if (!db) {
        console.error("Error connecting to MongoDB");
        process.exit(1);
    }

    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use("/api/user", UserAPI);
    app.use("/api/gm", GMAPI);
    app.use("/api/dm", DMAPI);

    app.get("/", (_req, res) => {
        res.send("Welcome to the API");
    });

    app.listen(port, () => {
        console.log(`Express server running on port ${port}`);
    });
};

main();

