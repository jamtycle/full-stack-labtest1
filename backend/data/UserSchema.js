const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 3,
        required: true,
        unique: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createon: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const User = mongoose.model("labtest1-user", userSchema);

module.exports = {
    User,
};
