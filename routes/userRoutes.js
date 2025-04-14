const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const userController = require("../controllers/userController");

router.get("/", authMiddleware, (req, res) => {
  const id = req.userId;
  res.render("users/index", { id: id });
});

router.get("/delete", authMiddleware, (req, res) => {
  res.render("users/delete");
});

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
