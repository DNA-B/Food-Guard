const { SECRET_KEY } = require("../config/config.js");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const chatHandler = require("../sockets/chatHandler.js");

const setupSocket = (server, app) => {
  const io = new Server(server, { connectionStateRecovery: {} });

  io.use((socket, next) => {
    try {
      const rawCookies = socket.handshake.headers.cookie;
      if (!rawCookies) return next(new Error("Authentication error"));

      const parsed = cookie.parse(rawCookies);
      const token = parsed.token;

      if (!token) return next(new Error("Authentication error"));

      const decoded = jwt.verify(token, SECRET_KEY);
      socket.userId = decoded._id; // req.userId 대신 socket.userId에 저장
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    chatHandler(io, socket);
  });
};

module.exports = setupSocket;
