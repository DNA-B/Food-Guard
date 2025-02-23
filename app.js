const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const methodOverride = require("method-override");

const app = express();
const { PORT } = require("./config/config");

// DB Connecting
require("./config/db.js");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayouts);
app.set("layout", "layout");

// Routing
const indexRouter = require("./routes/index.routes.js");
app.use(indexRouter);

// Listening
app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
});
