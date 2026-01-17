const ChatRoom = require("../models/chatRoomModel.js");
const Chat = require("../models/chatModel.js");
const Donation = require("../models/donationModel.js");

// create chat chatRoom
const createChatRoom = async (donationId, userId) => {
  const donation = await Donation.findById(donationId);

  if (!donation) {
    const error = new Error("해당 나눔 게시글을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  const chatRooms = await ChatRoom.findOne({
    donation: donationId,
    users: { $all: [donation.author, userId] },
  });

  if (!chatRooms) {
    const newChatRoom = new ChatRoom({
      donation: donationId,
      users: [donation.author, userId],
    });
    await newChatRoom.save();
    return newChatRoom;
  }

  return chatRooms;
};

const findMessagesByRoomId = async (chatRoomId) => {
  const chats = await Chat.find({ chatRoom: chatRoomId }).populate("sender");

  if (!chats) {
    const error = new Error("채팅 내역을 불러올 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return chats;
};

const findAllRoomsByUserId = async (userId) => {
  const chatRooms = await ChatRoom.find({ users: userId })
    .populate("users")
    .populate("donation", "title");
  return chatRooms;
};

const closeChatRoom = async (donationId, chatRoomId) => {
  const chatRoom = await ChatRoom.findById(chatRoomId);

  if (!chatRoom) {
    const error = new Error("채팅방을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  const donation = await Donation.findById(donationId).populate("food");

  if (!donation) {
    const error = new Error("기부 내역을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  chatRoom.isClosed = true;
  await chatRoom.save();

  donation.food.group = null;
  donation.food.isDonated = true;
  await donation.food.save();
  await donation.save();
};

module.exports = {
  createChatRoom,
  findMessagesByRoomId,
  findAllRoomsByUserId,
  closeChatRoom,
};
