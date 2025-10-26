const Group = require("../models/groupModel");
const Food = require("../models/foodModel");

const createGroup = async (name, description, userId) => {
  if (!name) {
    const error = new Error("필수 조건을 모두 입력해주세요.");
    error.statusCode = 422;
    throw error;
  }

  const newGroup = new Group({
    name: name,
    manager: userId,
    description: description,
    users: [userId],
  });

  const savedGroup = await newGroup.save();
  console.log("Saved Group:", savedGroup);
};

const findAllGroupByUserId = async (userId) => {
  const findGroups = await Group.find({ users: userId });

  if (!findGroups) {
    const error = new Error("그룹을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return findGroups;
};

const findGroupById = async (id) => {
  const findGroup = await Group.findById(id);

  if (!findGroup) {
    const error = new Error("그룹을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return findGroup;
};

const updateGroup = async (id, name, description) => {
  if (!id) {
    const error = new Error("그룹을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  await Group.updateOne(
    { _id: id },
    {
      name: name,
      description: description,
    }
  );
};

const exitGroup = async (id, userId) => {
  const group = await Group.findById(id);

  if (!group) {
    const error = new Error("그룹을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  // error, if user not in group
  if (!group.users.includes(userId)) {
    const error = new Error("유저가 그룹에 속해있지 않습니다.");
    error.statusCode = 400;
    throw error;
  }

  // delete group
  const deleteResult = await Food.deleteMany({ user: userId, group: id });

  // if last user, delete group
  if (group.users.length === 1) {
    console.log(`Delete group: ${id}`);
    await Group.deleteOne({ _id: id });
    return;
  }

  const newManager = group.users.find((user) => !user.equals(userId));
  await Group.updateOne(
    { _id: id },
    { $pull: { users: userId }, $set: { manager: newManager } }
  );
};

module.exports = {
  findAllGroupByUserId,
  findGroupById,
  createGroup,
  updateGroup,
  exitGroup,
};
