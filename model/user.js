const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: String,
  password: String,
  isAdmin: Boolean,
  "Payment history": [
    {
      "Transaction id": Date,
      Destination: String,
      "Payment time": Date,
      Amount: Number,
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
