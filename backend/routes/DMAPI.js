const express = require("express");
const { DirectMessage } = require("../data/DMSchema");

const GMAPI = express.Router();

GMAPI.get("/", async (_req, res) => {
    const to_user = _req.query.to_user;
    const from_user = _req.query.from_user;
    let data = await DirectMessage.find({
        $or: [
            {
                to_user: to_user,
                from_user: from_user,
            },
            {
                to_user: from_user,
                from_user: to_user,
            },
        ],
    });
    return res.send(data);
});

GMAPI.post("/", async (req, res) => {
    if (!req.body) return res.sendStatus(400);

    try {
        await new DirectMessage(req.body).save();
        return res.sendStatus(201);
    } catch (ex) {
        console.error(ex);
        return res.sendStatus(500);
    }
});

GMAPI.delete("/:_id", async (req, res) => {
    if (!req.body) return res.sendStatus(400);

    try {
        await DirectMessage.deleteOne({ _id: req.params._id });
        return res.sendStatus(200);
    } catch (ex) {
        console.error(ex);
        return res.sendStatus(500);
    }
});

module.exports = GMAPI;
