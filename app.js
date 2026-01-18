// library
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// config
const { createServer } = require("node:http");
const { PORT } = require("./config/config");
const setupSocket = require("./config/socket.js");

const logger = require("./middleware/logger.js");
const indexRouter = require("./routes/indexRoutes.js");

// DB Connecting
require("./config/db.js");

const app = express();
const server = createServer(app);

// middleware
app.use(cors()); // 모든 도메인에서의 요청 허용
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());

// 템플릿에서 쿠키 접근 가능하도록 설정
app.use((req, res, next) => {
  res.locals.cookies = req.cookies;
  next();
});

// ejs template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);
app.set("layout", "layout");

// Routing
app.use(logger);
app.use(indexRouter);

// Swagger
const { swaggerUi, specs } = require("./config/swagger");
if (process.env.NODE_ENV === "development") {
  // 개발 환경일 때만 Swagger 연결
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}

// Listening
setupSocket(server, app);
server.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
});
