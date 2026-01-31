const mongoose = require("mongoose");
const { Schema } = mongoose;

const donationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    // 찜
  },
  { timestamps: true },
);

const Donation = mongoose.model("Donation", donationSchema);
module.exports = Donation;
