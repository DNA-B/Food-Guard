const Chat = require("../models/chatModel.js");
const ChatRoom = require("../models/chatRoomModel.js");

module.exports = (io, socket) => {
  // 1. 채팅방 입장
  socket.on("join_chat_room", async (chatRoomId) => {
    try {
      const findRoom = await ChatRoom.findById(chatRoomId);

      if (!findRoom) {
        return socket.emit("error", { message: "존재하지 않는 방입니다." });
      }

      if (findRoom.isClosed) {
        return socket.emit("error", { message: "대화가 종료된 채팅방입니다." });
      }

      socket.join(chatRoomId);
      console.log(`[Socket] 유저(${socket.id})가 방(${chatRoomId})에 입장함`);
    } catch (error) {
      console.error("Join Room Error:", error);
    }
  });

  // 2. 메시지 전송
  socket.on("send_message", async (data) => {
    try {
      const { chatRoom, sender, content } = data;

      const newMessage = new Chat({
        chatRoom,
        sender,
        content,
      });

      await newMessage.save();

      const fullMessage = await Chat.findById(newMessage._id).populate("sender", "nickname");

      io.to(chatRoom).emit("receive_message", fullMessage);
    } catch (error) {
      console.error("Message Send Error:", error);
      socket.emit("error", { message: "메시지 전송에 실패했습니다." });
    }
  });

  // 3. disconnect
  socket.on("disconnect", async (data) => {
    try {
      const { chatRoom } = data;
      console.log(`[Socket] 유저(${socket.id})가 방(${chatRoom})에서 나감`);
    } catch (error) {}
  });

  // 4. 나눔 종료
  socket.on("end-donation", async (data) => {
    try {
      // TODO: 기부 종료 로직 처리 (DB 반영 등)
      socket.emit("redirection", { redirectUrl: "/donations" });
    } catch (error) {}
  });

  // // 5. 타이핑 상태 알림
  // socket.on("typing", (data) => {
  //   socket.to(data.chatRoom).emit("display_typing", { user: data.user });
  // });
};
