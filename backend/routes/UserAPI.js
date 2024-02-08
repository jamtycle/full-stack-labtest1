const express = require("express");
const { User } = require("../data/UserSchema");

const UserAPI = express.Router();

UserAPI.post("/signup", async (req, res) => {
    if (!req.body) return res.sendStatus(400);

    try {
        await new User(req.body).save();
        return res.sendStatus(201);
    } catch (ex) {
        console.error(ex);
        return res.sendStatus(500);
    }
});

UserAPI.post("/login", async (req, res) => {
    if (!req.body) return res.sendStatus(400);

    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.sendStatus(500);

        if (user.password !== req.body.password) return res.sendStatus(401);

        return res.send({ result: true, user });
    } catch (ex) {
        console.error(ex);
        return res.sendStatus(500);
    }
});

module.exports = UserAPI;
