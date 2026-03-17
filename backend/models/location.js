const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  studentId: String,
  lat: Number,
  lng: Number,
  lastUpdated: Date
});

module.exports = mongoose.model("Location", LocationSchema);