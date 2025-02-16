const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Group is hard");
});

module.exports = router;
