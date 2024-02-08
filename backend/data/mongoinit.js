const mongoose = require("mongoose");

/**
 *
 * @returns {Promise<boolean>} true if the connection was successful, false otherwise
 */
const mongoInit = async () =>
    mongoose
        .connect(
            "mongodb+srv://bramirez:xBu1RW4CroY5KUQp@fstack2.gepbzac.mongodb.net/?retryWrites=true&w=majority",
            {
                useNewUrlParser: true,
            },
        )
        .then(() => {
            mongoose.set("toJSON", { useProjection: true });
            mongoose.set("toObject", { useProjection: true });
            return true;
        })
        .catch((error) => {
            console.error("Error connecting to MongoDB:", error);
            return false;
        });

module.exports = {
    mongoInit,
};
