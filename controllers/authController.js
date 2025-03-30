const { User } = require("../models/userModel");
const { bcryptHash, comparePassword } = require("../utils/bcrypt");
const createJWT = require("../utils/createJWT");

const registerUser = async (username, password, nickname) => {
  try {
    const hashedPassword = await bcryptHash(password);
    const user = new User({
      username: username,
      password: hashedPassword,
      nickname: nickname,
    });

    await user.save();
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
};

const loginUser = async (username, password) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    if (username !== user.username) {
      throw new Error("Invalid credentials");
    }

    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    }

    return { user: user, token: createJWT(user) };
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

module.exports = { registerUser, loginUser };
