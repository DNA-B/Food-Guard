const mongoose = require("mongoose");
const { Schema } = mongoose;

const foodSchema = new Schema({
  foodName: { type: String, require: true },
  expirationDate: { type: Date },
});

const Food = mongoose.model("Food", foodSchema);
module.exports = Food;
