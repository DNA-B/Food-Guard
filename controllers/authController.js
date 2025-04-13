const { bcryptHash, comparePassword } = require("../utils/bcrypt");
const createJWT = require("../utils/createJWT");
const User = require("../models/userModel");

const registerUser = async (username, password, nickname) => {
  try {
    if (!username || !password || !nickname) {
      res.status(422).render("error", {
        message: "필수 조건을 모두 입력해주세요.",
      });
    }

    const hashedPassword = await bcryptHash(password);
    const user = new User({
      username: username,
      password: hashedPassword,
      nickname: nickname,
    });

    await user.save();
  } catch (error) {
    res.status(500).render("error", { message: error.message });
  }
};

const loginUser = async (username, password) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).render("error", { message: "사용자를 찾을 수 없습니다" });
    }

    if (username !== user.username) {
      res.status(401).render("error", { message: "잘못된 인증 정보입니다" });
    }

    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      res.status(401).render("error", { message: "잘못된 인증 정보입니다" });
    }

    return { user: user, token: createJWT(user) };
  } catch (error) {
    res.status(500).render("error", { message: error.message });
  }
};

module.exports = { registerUser, loginUser };
