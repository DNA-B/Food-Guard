const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  nickname: { type: String, unique: true },
});

const User = mongoose.model("User", userSchema);

module.exports = { userSchema, User };
