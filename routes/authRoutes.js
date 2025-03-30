const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authController.loginUser(username, password);

    res.cookie("token", result.token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000, // 2시간
    });
    res.redirect("/");
  } catch (error) {
    res.render("login", { error: error.message });
  }
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { username, password, nickname } = req.body;

    if (!username || !password || !nickname) {
      throw new Error("All fields (username, password, nickname) are required");
    }

    await authController.registerUser(username, password, nickname);
    res.redirect("/login");
  } catch (error) {
    res.render("register", { error: error.message, data: req.body });
  }
});

router.get("/logout", authMiddleware, (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
