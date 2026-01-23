// Connection
const mongoose = require("mongoose");
const { MONGO_URI } = require("./config.js");

mongoose
  .connect(MONGO_URI)
  .then(() => console.log(">> DataBase Connection Complete <<"))
  .catch((err) => console.error("Connection Failed: ", err));
