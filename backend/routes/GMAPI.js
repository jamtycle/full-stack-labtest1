const express = require("express");
const { GroupMessage } = require("../data/GMSchema");

const GMAPI = express.Router();

GMAPI.get("/", async (_req, res) => {
    const room = _req.query.room;
    const data = await GroupMessage.find({ room: room });
    return res.send(data);
});

GMAPI.post("/", async (req, res) => {
    if (!req.body) return res.sendStatus(400);

    try {
        await new GroupMessage(req.body).save();
        return res.sendStatus(201);
    } catch (ex) {
        console.error(ex);
        return res.sendStatus(500);
    }
});

GMAPI.delete("/:_id", async (req, res) => {
    if (!req.body) return res.sendStatus(400);

    try {
        await GroupMessage.deleteOne({ _id: req.params._id });
        return res.sendStatus(200);
    } catch (ex) {
        console.error(ex);
        return res.sendStatus(500);
    }
});

module.exports = GMAPI;
