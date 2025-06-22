const User = require("../models/userModel");
const Group = require("../models/groupModel");

const findOneUser = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    const error = new Error("유저를 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const findAllUsersByGroupId = async (groupId) => {
  const group = await Group.findById(groupId).populate("users");

  if (!group) {
    const error = new Error("그룹을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return {
    users: group.users,
    managerId: group.manager,
  };
};

const deleteOneUser = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    const error = new Error("유저를 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  await user.deleteOne();
};

module.exports = {
  findOneUser,
  findAllUsersByGroupId,
  deleteOneUser,
};
