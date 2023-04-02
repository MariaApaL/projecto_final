const mongoose = require("mongoose");

const Category = mongoose.model(
  "category",
  new mongoose.Schema({
    type: String
  })
);

module.exports = Category;