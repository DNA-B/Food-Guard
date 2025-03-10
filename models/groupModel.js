const mongoose = require("mongoose");
const { userSchema } = require("./userModel.js");
const { Schema } = mongoose;

const groupSchema = new Schema({
  groupName: { type: String, require: true },
  userList: [userSchema],
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
