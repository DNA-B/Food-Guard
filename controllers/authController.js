const { bcryptHash, comparePassword } = require("../utils/bcrypt");
const createJWT = require("../utils/createJWT");
const User = require("../models/userModel");

const checkDuplicateNickname = async (nickname) => {
  const exists = await User.exists({ nickname: nickname });
  return !!exists; // 중복이면 true, 아니면 false 반환
};

const registerUser = async (username, password, nickname) => {
  if (!username || !password || !nickname) {
    const error = new Error("필수 조건을 모두 입력해주세요.");
    error.statusCode = 422;
    throw error;
  }

  const hashedPassword = await bcryptHash(password);
  const newUser = new User({
    username: username,
    password: hashedPassword,
    nickname: nickname,
  });

  await newUser.save();
};

const loginUser = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) {
    const error = new Error("사용자를 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  if (username !== user.username) {
    const error = new Error("잘못된 인증 정보입니다.");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordMatch = await comparePassword(password, user.password);
  if (!isPasswordMatch) {
    const error = new Error("잘못된 인증 정보입니다.");
    error.statusCode = 401;
    throw error;
  }

  return { user: user, token: createJWT(user) };
};

module.exports = { checkDuplicateNickname, registerUser, loginUser };
