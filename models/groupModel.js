const mongoose = require("mongoose");
const { Schema } = mongoose;

const groupSchema = new Schema({
  groupName: {
    type: String,
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
});

const Group = mongoose.model("Group", groupSchema);
module.exports = Group;
