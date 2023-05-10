const mongoose = require("mongoose");

const Report = mongoose.model(
  "report",
  new mongoose.Schema({
    type: String
  })
);

module.exports = Report;