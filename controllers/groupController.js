const Group = require("../models/groupModel");
const { Invite, INVITE_STATUS } = require("../models/inviteModel");
const { Food } = require("../models/foodModel");

const existPendingInvitesByUserId = async (userId) => {
  const exists = await Invite.exists({
    recipient: userId,
    status: INVITE_STATUS.PENDING,
  });
  return !!exists;
};

const findAllPendingInvitesByUserId = async (userId) => {
  const invites = await Invite.where({
    recipient: userId,
    status: INVITE_STATUS.PENDING,
  })
    .populate("sender", "username")
    .populate("group", "name");

  if (!invites) {
    const error = new Error("초대장을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return invites;
};

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

  await newGroup.save();
};

const findAllGroupByUserId = async (userId) => {
  const groups = await Group.find({ users: userId });

  if (!groups) {
    const error = new Error("그룹을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return groups;
};

const findGroupById = async (id) => {
  const group = await Group.findById(id);

  if (!group) {
    const error = new Error("그룹을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return group;
};

const updateGroup = async (id, name, description) => {
  const group = await Group.findById(id);

  if (!group) {
    const error = new Error("그룹을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  group.name = name;
  group.description = description;
  await group.save();
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

  // delete user's food in group
  const deleteResult = await Food.deleteMany({ user: userId, group: id });

  // if last user, delete group
  if (group.users.length === 1) {
    console.log(`Delete group: ${id}`);
    await group.deleteOne();
    return;
  }

  // new manager select
  if (group.manager.equals(userId)) {
    const newManager = group.users.find((user) => !user.equals(userId));
    group.manager = newManager;
  }

  group.users.pull(userId);
  await group.save();
};

module.exports = {
  existPendingInvitesByUserId,
  findAllPendingInvitesByUserId,
  findAllGroupByUserId,
  findGroupById,
  createGroup,
  updateGroup,
  exitGroup,
};
