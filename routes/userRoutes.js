const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const userController = require("../controllers/userController");

// get user page
router.get("/", authMiddleware, async (req, res) => {
  try {
    const id = req.userId;
    const user = await userController.findOneUser(id);
    console.log(user);
    res.render("users", { username: user.username });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// get user delete page
router.get("/delete", authMiddleware, (req, res) => {
  // TODO
  res.render("users/delete");
});

// user delete process
router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    const id = req.userId;
    await userController.deleteOneUser(id);
    res.clearCookie("token");
    res.redirect("/");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

module.exports = router;
