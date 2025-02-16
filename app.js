require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

// 미들웨어 추가
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// routing
const index = require("./routes/index.routes.js");
const userRouter = require("./routes/users.routes.js");
const foodRouter = require("./routes/foods.routes.js");
const groupRouter = require("./routes/groups.routes.js");

app.use("/", index);
app.use("/users", userRouter);
app.use("/foods", foodRouter);
app.use("/groups", groupRouter);

// DataBase
const { userModel } = require("./models/user.model.js");
const groupModel = require("./models/group.model.js");
const foodModel = require("./models/food.model.js");

// Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log(">> DataBase Connection Complete <<"))
  .catch((err) => console.error("Connection Failed: ", err));

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
});
