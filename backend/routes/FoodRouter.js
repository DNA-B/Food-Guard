const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Food List");
});

router.get("/create", (req, res) => {
  res.send("Your Food");
});

router.post("/create", (req, res) => {
  res.send("Upload your food");
});

module.exports = router;
