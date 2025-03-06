const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", (req, res) => {
  res.render("users/index");
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    await userController.loginUser(username, password);
    res.redirect("/");
  } catch (error) {
    res.render("users/login", { error: error.message });
  }
});

router.get("/register", (req, res) => {
  res.render("users/register"); // 'users-register'에서 'users/register'로 수정 권장
});

router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { username, password, nickname } = req.body;

    if (!username || !password || !nickname) {
      throw new Error("All fields (username, password, nickname) are required");
    }

    await userController.registerUser(username, password, nickname);
    res.redirect("/users/login");
  } catch (error) {
    res.render("users/register", { error: error.message, data: req.body });
  }
});

module.exports = router;
