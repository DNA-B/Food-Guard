const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index.ejs");
});

router.get("/test", (req, res) => {
  res.render("index.ejs");
});

// routing
const userRouter = require("./users.routes.js");
const foodRouter = require("./foods.routes.js");
const groupRouter = require("./groups.routes.js");

router.use("/users", userRouter);
router.use("/foods", foodRouter);
router.use("/groups", groupRouter);

module.exports = router;
