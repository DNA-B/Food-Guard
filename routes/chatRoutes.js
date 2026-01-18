const express = require("express");
const router = express.Router({ mergeParams: true }); // donationId 사용
const chatController = require("../controllers/chatController.js");
const donationController = require("../controllers/donationController.js");
const ChatRoom = require("../models/chatRoomModel.js");

/**
 * @swagger
 * /donations/{donation_id}/chats:
 *   post:
 *     summary: Create a new chat room
 *     tags:
 *       - Chat
 *     parameters:
 *       - in: path
 *         name: donation_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to chat room
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.post("/", async (req, res) => {
  try {
    const donationId = req.params.donation_id;
    const userId = req.userId;
    const chatRoom = await chatController.createChatRoom(donationId, userId);
    res.redirect(`/donations/${donationId}/chats/${chatRoom._id}`);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /donations/{donation_id}/chats/{chat_room_id}:
 *   get:
 *     summary: Get chat room detail page
 *     tags:
 *       - Chat
 *     parameters:
 *       - in: path
 *         name: donation_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: chat_room_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat room page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/:chat_room_id", async (req, res) => {
  try {
    const { donation_id: donationId, chat_room_id: chatRoomId } = req.params;
    const donation = await donationController.findDonationById(donationId);
    const isAuthor = donation.author._id.equals(req.userId);
    const messages = await chatController.findMessagesByRoomId(chatRoomId);
    const chatRoom = await ChatRoom.findById(chatRoomId);

    res.render("donations/chats/chatRoom", {
      donationId: donation._id,
      chatRoomId: chatRoomId,
      messages: messages,
      userId: req.userId,
      isAuthor: isAuthor,
      isClosed: chatRoom.isClosed,
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /donations/{donation_id}/chats/{chat_room_id}/complete:
 *   put:
 *     summary: Complete the chat room
 *     tags:
 *       - Chat
 *     parameters:
 *       - in: path
 *         name: donation_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: chat_room_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to donations
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.put("/:chat_room_id/complete", async (req, res) => {
  try {
    const { donation_id: donationId, chat_room_id: chatRoomId } = req.params;
    await chatController.closeChatRoom(donationId, chatRoomId);
    res.redirect("../../");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

module.exports = router;
