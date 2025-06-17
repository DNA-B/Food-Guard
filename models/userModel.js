const mongoose = require("mongoose");
const { Schema } = mongoose;
const Food = require("./foodModel");
const Group = require("./groupModel");

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nickname: { type: String, unique: true },
  },
  { timestamps: true }
);

// User 삭제 시 관련 데이터 정리
userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await Food.deleteMany({ user: this._id }); // Food: 해당 User를 참조하는 모든 문서 삭제
      await Group.updateMany(
        // Group: users 배열에서 해당 User의 _id 제거
        { users: this._id },
        { $pull: { users: this._id } }
      );
      next();
    } catch (error) {
      console.error("Error in user delete cascade:", error);
      next(error);
    }
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
