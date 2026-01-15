const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.js");

// routing
const authRouter = require("./authRoutes.js");
const userRouter = require("./userRoutes.js");
const foodRouter = require("./foodRoutes.js");
const groupRouter = require("./groupRoutes.js");
const inviteRouter = require("./inviteRoutes.js");
const donationRouter = require("./donationRoutes.js");
const chatRouter = require("./chatRoutes.js");
const postRouter = require("./postRoutes.js");

router.get("/", (req, res) => {
  res.render("index.ejs");
});

router.get("/test", (req, res) => {
  res.render("index.ejs");
});

router.use("/", authRouter);
router.use("/users", authMiddleware, userRouter);
router.use("/foods", authMiddleware, foodRouter);
router.use("/groups", authMiddleware, groupRouter);
router.use("/groups/:group_id/invites", authMiddleware, inviteRouter);
router.use("/donations", authMiddleware, donationRouter);
router.use("/donations/:donation_id/chats", authMiddleware, chatRouter);
router.use("/posts", authMiddleware, postRouter);

module.exports = router;
