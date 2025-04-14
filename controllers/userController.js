const User = require("../models/userModel");

const deleteOneUser = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    const error = new Error("유저를 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  await user.deleteOne();
};

module.exports = { deleteOneUser };
