const mongoose = require("mongoose");
const { Schema } = mongoose;

const foodSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  expiryDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
    require: true,
  },
});

const Food = mongoose.model("Food", foodSchema);
module.exports = Food;
