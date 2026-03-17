const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
    name: String,
    pin: String,
    status: {
        type: String,
        default: "pending"
    }
});

module.exports = mongoose.model("Request", RequestSchema);