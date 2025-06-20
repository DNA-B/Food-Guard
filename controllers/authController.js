const { bcryptHash, comparePassword } = require("../utils/bcrypt");
const createJWT = require("../utils/createJWT");
const User = require("../models/userModel");

const checkDuplicateNickname = async (nickname) => {
  const user = await User.findOne({ nickname: nickname });
  return !!user; // 중복이면 true, 아니면 false 반환
};

const registerUser = async (username, password, nickname) => {
  if (!username || !password || !nickname) {
    throw new Error({
      message: "필수 조건을 모두 입력해주세요.",
      statusCode: 422,
    });
  }

  const hashedPassword = await bcryptHash(password);
  const user = new User({
    username: username,
    password: hashedPassword,
    nickname: nickname,
  });

  await user.save();
};

const loginUser = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error({
      message: "사용자를 찾을 수 없습니다.",
      statusCode: 404,
    });
  }

  if (username !== user.username) {
    throw new Error({
      message: "잘못된 인증 정보입니다.",
      statusCode: 401,
    });
  }

  const isPasswordMatch = await comparePassword(password, user.password);
  if (!isPasswordMatch) {
    throw new Error({
      message: "잘못된 인증 정보입니다.",
      statusCode: 401,
    });
  }

  return { user: user, token: createJWT(user) };
};

module.exports = { checkDuplicateNickname, registerUser, loginUser };
