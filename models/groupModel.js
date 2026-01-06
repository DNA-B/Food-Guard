const mongoose = require("mongoose");
const { Schema } = mongoose;

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

groupSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await Food.deleteMany({ group: this._id }); // Food: 해당 Group을 참조하는 모든 문서 삭제
      await invite.deleteMany({ group: this._id }); // Group: users 배열에서 해당 User의 _id 제거
      next();
    } catch (error) {
      console.error("Error in group delete cascade:", error);
      next(error);
    }
  }
);

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
