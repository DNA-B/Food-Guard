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

  const group = await Group.findOne({ _id: groupId });

  if (group.users.includes(recipientUser._id)) {
    const error = new Error("이미 그룹에 속한 사용자입니다.");
    error.statusCode = 409;
    throw error;
  }

  const exists = await Invite.exists({
    recipient: recipientUser._id,
    group: groupId,
    status: "pending",
  });

  if (!!exists) {
    const error = new Error("이미 초대장이 발송된 사용자입니다.");
    error.statusCode = 409;
    throw error;
  }

  const newInvite = new Invite({
    sender: userId,
    recipient: recipientUser._id,
    group: groupId,
  });

  await newInvite.save();
};

const findAllInviteById = async (userId) => {
  const invites = await Invite.find({ recipient: userId });

  if (!invites) {
    const error = new Error("게시물을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return invites;
};

const findInviteById = async (inviteId) => {
  const invites = await Invite.findById(inviteId).populate(
    "author",
    "username",
  );

  if (!invites) {
    const error = new Error("게시물을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return invites;
};

const acceptInviteById = async (groupId, inviteId) => {
  const invite = await Invite.findById(inviteId);
  const group = await Group.findById(groupId);

  if (!invite) {
    const error = new Error("초대를 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  if (!group) {
    const error = new Error("그룹을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  group.users.push(invite.recipient);
  await group.save();

  invite.status = INVITE_STATUS.ACCEPTED;
  await invite.save();
};

const rejectInviteById = async (inviteId) => {
  const invite = await Invite.findById(inviteId);

  if (!invite) {
    const error = new Error("초대를 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  invite.status = INVITE_STATUS.REJECTED;
  await invite.save();
};

module.exports = {
  createInvite,
  findAllInviteById,
  findInviteById,
  acceptInviteById,
  rejectInviteById,
};
