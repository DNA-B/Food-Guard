const ChatRoom = require("../models/chatRoomModel.js");
const Chat = require("../models/chatModel.js");
const Donation = require("../models/donationModel.js");

// create chat room
const createChat = async (donationId, userId) => {
  const findDonation = await Donation.findById(donationId).populate(
    "author",
    "_id"
  );

  if (!findDonation) {
    const error = new Error("해당 나눔 게시글을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  let room = await ChatRoom.findOne({
    donation: findDonation,
    users: { $all: [findDonation.author, userId] },
  });

  if (!room) {
    room = new ChatRoom({
      donation: donationId,
      users: [findDonation.author, userId],
    });
    await room.save();
  }

  return room;
};

const findMessagesByRoomId = async (roomId) => {
  const findChats = await Chat.find({ room: roomId })
    .populate("sender")
    .sort({ createdAt: 1 }); // 생성 날짜 오름차순

  if (!findChats) {
    const error = new Error("채팅 내역을 불러올 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return findChats;
};

const findAllRoomsByUserId = async (userId) => {
  const findRooms = await ChatRoom.find({ users: userId })
    .populate("users")
    .populate("donation", "title");
  return findRooms;
};

const closeChatRoom = async (donationId, roomId) => {
  const findChatRoom = await ChatRoom.findById(roomId);

  if (!findChatRoom) {
    const error = new Error("채팅방을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  const findDonation = await Donation.findById(donationId).populate("food");

  if (!findDonation) {
    const error = new Error("기부 내역을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  findChatRoom.isClosed = true;
  findDonation.food.group = null;
  findDonation.isDonated = true;

  await findChatRoom.save();
  await findDonation.food.save();
  await findDonation.save();
  console.log(`ChatRoom ${roomId} has been closed.`);
};

module.exports = {
  createChat,
  findMessagesByRoomId,
  findAllRoomsByUserId,
  closeChatRoom,
};
