const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  groupName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  ListUserId: [
    {
      type: String, // ID를 문자열로 저장
    },
  ],
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
