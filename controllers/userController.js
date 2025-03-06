const { User } = require("../models/userModel");
const { bcryptHash, comparePassword } = require("../utils/bcrypt");

const registerUser = async (username, password, nickname) => {
  try {
    const hashedPassword = await bcryptHash(password);
    const user = new User({
      username: username,
      password: hashedPassword,
      nickname: nickname,
    });
    const newUser = await user.save();
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
};

const loginUser = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await comparePassword(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid password");
  }

  return user;
};

module.exports = { registerUser, loginUser };
