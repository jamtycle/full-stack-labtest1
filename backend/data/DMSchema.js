const mongoose = require("mongoose");

const DMSchema = new mongoose.Schema({
    from_user: {
        type: String,
        required: true,
    },
    to_user: {
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

const DirectMessage = mongoose.model("labtest1-dm", DMSchema);

const dmActions = async (params) => {
    switch (params.action) {
        case "create":
            return await new DirectMessage(params.data).save();

        case "read":
            return await DirectMessage.find({ room: params.data.room });

        default:
            return false;
    }
};

module.exports = {
    DirectMessage,
    dmActions,
};
