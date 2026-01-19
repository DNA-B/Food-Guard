const mongoose = require("mongoose");
const { Schema } = mongoose;

const foodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    expiryAt: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
    isConsumed: {
      type: Boolean,
      default: false,
    },
    isDonated: {
      type: Boolean,
      default: false,
    },
    image: {
      url: String,
      filename: String, // Cloudinary에서 이미지를 식별/삭제할 때 쓰는 ID
    },
  },
  { timestamps: true },
);

const Food = mongoose.model("Food", foodSchema);
module.exports = Food;
