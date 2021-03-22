const mongoose = require("mongoose");

const BankSchema = mongoose.Schema({
  name: String,
  TimeStamp: Date,
  Branch: String,
  active: Boolean,
  hasMobileApp: Boolean,
});

module.exports = mongoose.model("Bank", BankSchema);
