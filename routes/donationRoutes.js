const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donationController.js");
const chatController = require("../controllers/chatController.js");
const foodController = require("../controllers/foodController.js");

/**
 * @swagger
 * /donations/create:
 *   get:
 *     summary: Get create donation page
 *     tags:
 *       - Donation
 *     responses:
 *       200:
 *         description: Create donation page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/create", async (req, res) => {
  try {
    const foods = await foodController.findAllFoodByUserId(req.userId);
    res.render("donations/create", {
      foods: foods ? foods.filter((food) => food.isDonated === false) : [],
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /donations/create:
 *   post:
 *     summary: Create a new donation
 *     tags:
 *       - Donation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - foodId
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               foodId:
 *                 type: string
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
router.post("/create", async (req, res) => {
  try {
    const { title, content, foodId } = req.body;
    const userId = req.userId;
    await donationController.createDonation(title, content, foodId, userId);
    res.redirect("/donations");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /donations/chats:
 *   get:
 *     summary: Get chat list page
 *     tags:
 *       - Donation
 *     responses:
 *       200:
 *         description: Chat list page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/chats", async (req, res) => {
  try {
    const userId = req.userId;
    const chatRooms = await chatController.findAllRoomsByUserId(userId);
    res.render("donations/chats", { userId: userId, chatRooms: chatRooms });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /donations:
 *   get:
 *     summary: Find all donations
 *     tags:
 *       - Donation
 *     responses:
 *       200:
 *         description: Donations list page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const donations = await donationController.findAllDonation();
    res.render("donations/index", { donations: donations });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /donations/{id}:
 *   get:
 *     summary: Find one donation
 *     tags:
 *       - Donation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Donation detail page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const donation = await donationController.findDonationById(id);
    const isAuthor = donation.author._id.equals(req.userId);
    res.render("donations/detail", {
      donation,
      author: donation.author.username,
      isAuthor: isAuthor,
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /donations/{id}/edit:
 *   get:
 *     summary: Get edit donation page
 *     tags:
 *       - Donation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Edit donation page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/:id/edit", async (req, res) => {
  try {
    const id = req.params.id;
    const donation = await donationController.findDonationById(id);
    const foods = await foodController.findAllFoodByUserId(req.userId);
    res.render("donations/edit", {
      donation: donation,
      foods: foods
        ? foods.filter((food) => !donation.food.equals(food) && !food.isDonated)
        : [],
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /donations/{id}/edit:
 *   put:
 *     summary: Edit donation
 *     tags:
 *       - Donation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to donation detail
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.put("/:id/edit", async (req, res) => {
  try {
    const id = req.params.id;
    const donation = await donationController.findDonationById(id);

    if (!donation) {
      const error = new Error("나눔을 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }

    const { title, content, foodId } = req.body;
    await donationController.updateDonation(id, title, content, foodId);
    res.redirect(`/donations/${id}`);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /donations/{id}:
 *   delete:
 *     summary: Delete donation
 *     tags:
 *       - Donation
 *     parameters:
 *       - in: path
 *         name: id
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
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const donation = await donationController.findDonationById(id);

    if (!donation) {
      const error = new Error("나눔을 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }

    await donationController.deleteDonation(id);
    res.redirect("/donations");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

module.exports = router;
