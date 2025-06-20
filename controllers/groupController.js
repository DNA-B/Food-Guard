const Group = require("../models/groupModel");
const Food = require("../models/foodModel");

const findAllGroupByUserId = async (userId) => {
  const findGroups = await Group.find({ users: userId });

  if (!findGroups) {
    throw new Error({ message: "그룹을 찾을 수 없습니다.", statusCode: 404 });
  }

  return findGroups;
};

const findOneGroup = async (id) => {
  const findGroup = await Group.findById(id);

  if (!findGroup) {
    throw new Error({ message: "그룹을 찾을 수 없습니다.", statusCode: 404 });
  }

  return findGroup;
};

const createGroup = async (name, description, userId) => {
  if (!name) {
    throw new Error({
      message: "필수 조건을 모두 입력해주세요.",
      statusCode: 422,
    });
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

const updateOneGroup = async (id, name, description) => {
  if (!id) {
    throw new Error({ message: "그룹을 찾을 수 없습니다.", statusCode: 404 });
  }

  await Group.updateOne(
    { _id: id },
    {
      name: name,
      description: description,
    }
  );
};

const exitOneGroup = async (id, userId) => {
  const group = await Group.findById(id);

  if (!group) {
    throw new Error({ message: "그룹을 찾을 수 없습니다.", statusCode: 404 });
  }

  // error, if user not in group
  if (!group.users.includes(userId)) {
    throw new Error({
      message: "유저가 그룹에 속해있지 않습니다.",
      statusCode: 400,
    });
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
  const updateResult = await Group.updateOne(
    { _id: id },
    { $pull: { users: userId }, $set: { manager: newManager } }
  );
};

module.exports = {
  findAllGroupByUserId,
  findOneGroup,
  createGroup,
  updateOneGroup,
  exitOneGroup,
};
