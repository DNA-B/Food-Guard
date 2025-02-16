const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("maybe user page");
});

router.get("/login", (req, res) => {
  res.send("username, password");
});

module.exports = router;
