const express = require("express");
const router = express.Router();
const { User } = require("../models/user.model");
const { bcryptHash } = require("../middleware/bcrypt");

router.get("/", (req, res) => {
  res.render("users/index");
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/login", async (req, res) => {
  try {
    console.log("request: ", req.body);
    const hashedPassword = await bcryptHash(req.body.password);
    const user = await User.find({ username: req.body.username });

    if (!user) {
      res.render("users/login", { error: "유저를 찾을 수 없습니다" });
    }

    if (user.username != req.body.username || user.password != hashedPassword) {
      res.render("users/login", { error: "로그인 실패" });
    }

    console.log("Saved User:", user);
    res.redirect("/");
  } catch (error) {
    console.error("Error:", error);
    res.render("users/login", {
      error: error.message,
      food: req.body,
    });
  }
});

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res) => {
  try {
    console.log("request: ", req.body);
    const hashedPassword = await bcryptHash(req.body.password);
    const user = new User({
      username: req.body.username,
      password: hashedPassword, // 해시된 비밀번호 저장
      nickname: req.body.nickname, // 오타 수정
    });

    const savedUser = await user.save(); // 사용자 저장
    console.log("Saved User:", savedUser);
    res.redirect("/users/login");
  } catch (error) {
    console.error("Error:", error);
    res.render("users/register", {
      error: error.message,
      food: req.body,
    });
  }
});

module.exports = router;
