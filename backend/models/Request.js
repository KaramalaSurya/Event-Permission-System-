const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  name: String,
  pin: String,
  section: String,
  reason: String,
  fromPeriod: Number,
  toPeriod: Number,
  hours: Number,
  status: String,
  expiryTime: Date
}, { timestamps: true }); // 🔥 VERY IMPORTANT

module.exports = mongoose.model("Request", requestSchema);