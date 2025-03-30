const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/config.js");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("token is none");
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded._id;
    next();
  } catch (error) {
    console.error("JWT 검증 실패:", error.message);
    res.clearCookie("token");
    res.redirect("/login");
  }
};

module.exports = authMiddleware;
