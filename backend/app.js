require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

const express = require("express");
const mongoose = require("mongoose");
const app = express();

// routing
const index = require("./routes/Index.js");
const userRouter = require("./routes/UserRouter.js");
const foodRouter = require("./routes/FoodRouter.js");
const groupRouter = require("./routes/GroupRouter.js");

app.use("/", index);
app.use("/user", userRouter);
app.use("/food", foodRouter);
app.use("/group", groupRouter);

// DataBase
const { userModel } = require("./models/User.js");
const groupModel = require("./models/Group.js");
const foodModel = require("./models/Food.js");

// Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log(">> DataBase Connection Complete <<"))
  .catch((err) => console.error("Connection Failed: ", err));

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
});
