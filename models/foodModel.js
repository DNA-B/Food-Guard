const mongoose = require("mongoose");
const { Schema } = mongoose;
const Donation = require("./donationModel.js");

const foodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    expiryAt: {
      type: Date,
      default: null,
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
    // TODO: ENUM으로 변경
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

// Food 삭제 시 관련 데이터 정리
foodSchema.pre(
  "deleteOne",
  // document 미들웨어로 설정, 여기서 this는 삭제되는 Group 문서
  // 만약 query로 삭제할 경우에는 pre가 실행되지 않음
  { document: true, query: false },
  async function (next) {
    try {
      await Donation.deleteMany({ food: this._id }); // Food: 해당 Food를 참조하는 모든 Donation 문서 삭제
      next();
    } catch (error) {
      console.error("Error in food delete cascade:", error);
      next(error);
    }
  },
);

const Food = mongoose.model("Food", foodSchema);
module.exports = Food;
