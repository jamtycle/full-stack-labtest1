const mongoose = require("mongoose");

const GroupMessageSchema = new mongoose.Schema({
    from_user: {
        type: String,
        required: true,
    },
    room: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    date_sent: {
        type: Date,
        required: true,
    },
});

const GroupMessage = mongoose.model(
    "labtest1-groupmessage",
    GroupMessageSchema
);

const gmActions = async (params) => {
    switch (params.action) {
        case "create":
            return await new GroupMessage(params.data).save();

        case "read":
            return await GroupMessage.find({ room: params.data.room });

        default:
            return false;
    }
};

module.exports = {
    GroupMessage,
    gmActions,
};
