const mongoose = require("mongoose");
const { Schema } = mongoose;
const Food = require("./foodModel");
const { Invite } = require("./inviteModel");

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

// Group 삭제 시 관련 데이터 정리
groupSchema.pre(
  "deleteOne",
  // document 미들웨어로 설정, 여기서 this는 삭제되는 Group 문서
  // 만약 query로 삭제할 경우에는 pre가 실행되지 않음
  { document: true, query: false },
  async function (next) {
    try {
      await Food.deleteMany({ group: this._id }); // Food: 해당 Group을 참조하는 모든 문서 삭제
      await Invite.deleteMany({ group: this._id }); // Group: users 배열에서 해당 User의 _id 제거
      next();
    } catch (error) {
      console.error("Error in group delete cascade:", error);
      next(error);
    }
  }
);

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
