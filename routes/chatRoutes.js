const express = require("express");
const router = express.Router({ mergeParams: true });
const chatController = require("../controllers/chatController.js");
const donationController = require("../controllers/donationController.js");
const ChatRoom = require("../models/chatRoomModel.js");
// create Chat
router.post("/", async (req, res) => {
  try {
    const donationId = req.params.donation_id;
    const userId = req.userId;
    const room = await chatController.createChat(donationId, userId);
    res.redirect(`/donations/${donationId}/chats/${room._id}`);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// get chat detail page
router.get("/:room_id", async (req, res) => {
  try {
    const { donation_id: donationId, room_id: roomId } = req.params;
    const findDonation = await donationController.findDonationById(donationId);
    const isAuthor = req.userId === findDonation.author._id.toString();
    const findMessages = await chatController.findMessagesByRoomId(roomId);
    const findRoom = await ChatRoom.findById(roomId);

    res.render("donations/chats/room", {
      donationId: donationId,
      roomId: roomId,
      messages: findMessages,
      userId: req.userId,
      isAuthor: isAuthor,
      isClosed: findRoom.isClosed,
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// end chat process
router.put("/:id/complete", async (req, res) => {
  try {
    const { donation_id, id } = req.params;
    await chatController.closeChatRoom(donation_id, id);
    res.redirect("../../");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

module.exports = router;
