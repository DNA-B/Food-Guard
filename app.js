const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");

const app = express();
const { PORT } = require("./config/config");

const logger = require("./middleware/logger.js");
const indexRouter = require("./routes/indexRoutes.js");

// DB Connecting
require("./config/db.js");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());

// 템플릿에서 쿠키 접근 가능하도록 설정
app.use((req, res, next) => {
  res.locals.cookies = req.cookies;
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayouts);
app.set("layout", "layout");

// Routing
app.use(logger);
app.use(indexRouter);

// Listening
app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
});
