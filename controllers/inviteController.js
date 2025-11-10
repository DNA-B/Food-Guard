const { Invite, INVITE_STATUS } = require("../models/inviteModel");
const User = require("../models/userModel");
const Group = require("../models/groupModel");

const createInvite = async (nickname, userId, groupId) => {
  if (!nickname) {
    const error = new Error("필수 조건을 모두 입력해주세요.");
    error.statusCode = 422;
    throw error;
  }

  const recipientUser = await User.findOne({ nickname: nickname });

  if (!recipientUser) {
    const error = new Error("해당 닉네임의 사용자가 존재하지 않습니다.");
    error.statusCode = 404;
    throw error;
  }

  const existingUserInGroup = await Group.findOne({ _id: groupId });

  if (existingUserInGroup.users.includes(recipientUser._id)) {
    const error = new Error("이미 그룹에 속한 사용자입니다.");
    error.statusCode = 409;
    throw error;
  }

  const existingInvite = await Invite.findOne({
    recipient: recipientUser._id,
    group: groupId,
    status: "pending",
  });

  if (existingInvite) {
    const error = new Error("이미 초대장이 발송된 사용자입니다.");
    error.statusCode = 409;
    throw error;
  }

  const newInvite = new Invite({
    sender: userId,
    recipient: recipientUser._id,
    group: groupId,
  });

  const savedInvite = await newInvite.save();
  return savedInvite;
};

const findAllInviteById = async (userId) => {
  const findInvites = await Invite.find({ recipient: userId });

  if (!findInvites) {
    const error = new Error("게시물을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return findInvites;
};

const findInviteById = async (id) => {
  const findInvite = await Invite.findById(id).populate("author", "username");

  if (!findInvite) {
    const error = new Error("게시물을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return findInvite;
};

const acceptInviteById = async (id, groupId) => {
  const findInvite = await Invite.findById(id);
  const findGroup = await Group.findById(groupId);

  if (!Invite) {
    const error = new Error("초대를 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  if (!findGroup) {
    const error = new Error("그룹을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  findGroup.users.push(findInvite.recipient);
  await findGroup.save();
  await Invite.updateOne({ _id: id }, { status: INVITE_STATUS.ACCEPTED });

  console.log(
    `user ${findInvite.recipient} accept invite to group ${findGroup.name}`
  );
};

const rejectInviteById = async (id) => {
  const findInvite = await Invite.findById(id);

  if (!Invite) {
    const error = new Error("초대를 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  await Invite.updateOne({ _id: id }, { status: INVITE_STATUS.REJECTED });

  console.log(
    `user ${findInvite.recipient} reject invite from user ${findInvite.sender}`
  );
};

module.exports = {
  createInvite,
  findAllInviteById,
  findInviteById,
  acceptInviteById,
  rejectInviteById,
};
