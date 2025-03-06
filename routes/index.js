const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index.ejs");
});

router.get("/test", (req, res) => {
  res.render("index.ejs");
});

// routing
const userRouter = require("./userRoutes.js");
const foodRouter = require("./foodRoutes.js");
const groupRouter = require("./groupRoutes.js");

router.use("/users", userRouter);
router.use("/foods", foodRouter);
router.use("/groups", groupRouter);

module.exports = router;
