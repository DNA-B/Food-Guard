const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const userController = require("../controllers/userController");

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get current user profile page
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const id = req.userId;
    const user = await userController.findUserById(id);
    res.render("users/index", { nickname: user.nickname });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /users/delete:
 *   get:
 *     summary: Get user account deletion page
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Delete user confirmation page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/delete", authMiddleware, (req, res) => {
  // TODO
  res.render("users/delete");
});

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Delete current user account
 *     tags:
 *       - User
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       302:
 *         description: Redirect to home page after account deletion
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    const id = req.userId;
    await userController.deleteUser(id);
    res.clearCookie("token");
    res.redirect("/");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

module.exports = router;
