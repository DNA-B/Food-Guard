const mongoose = require("mongoose");
const { Schema } = mongoose;

const foodSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  expiryDate: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Food = mongoose.model("Food", foodSchema);
module.exports = Food;
