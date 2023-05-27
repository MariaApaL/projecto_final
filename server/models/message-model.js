const mongoose = require("mongoose");

const Message = mongoose.model(
    "message",
    new mongoose.Schema({
        text: [

            {
                type: String,
            }
        ],

        transmitter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

    })
);

module.exports = Message;