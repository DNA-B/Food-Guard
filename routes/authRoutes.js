const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: Get login page
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Login page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/login", (req, res) => {
  res.render("login");
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to home
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authController.loginUser(username, password);

    res.cookie("token", result.token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.redirect("/");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /auth/register:
 *   get:
 *     summary: Get register page
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Register page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/register", (req, res) => {
  res.render("register");
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - nickname
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               nickname:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to login
 *       500:
 *         description: Server error
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password, nickname } = req.body;
    await authController.registerUser(username, password, nickname);
    res.redirect("/auth/login");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message });
  }
});

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout user
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       302:
 *         description: Redirect to home
 *       500:
 *         description: Server error
 */
router.get("/logout", authMiddleware, (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

/**
 * @swagger
 * /auth/check/nickname:
 *   post:
 *     summary: Check duplicate nickname
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nickname
 *             properties:
 *               nickname:
 *                 type: string
 *     responses:
 *       200:
 *         description: Duplicate check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isDuplicate:
 *                   type: boolean
 *       500:
 *         description: Server error
 */
router.post("/check/nickname", async (req, res) => {
  try {
    const { nickname } = req.body;
    const isDuplicate = await authController.checkDuplicateNickname(nickname);
    res.json({ isDuplicate });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message });
  }
});

module.exports = router;
