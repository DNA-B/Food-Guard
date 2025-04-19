const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const userController = require("../controllers/userController");

// get user page
router.get("/", authMiddleware, (req, res) => {
  const id = req.userId;
  res.render("users/index", { id: id });
});

// get user delete page
router.get("/delete", authMiddleware, (req, res) => {
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
      .render("error", { message: error.message });
  }
});

module.exports = router;
