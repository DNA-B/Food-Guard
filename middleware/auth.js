const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/config.js");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log(decoded);
    req.userId = decoded.id; // 사용자 정보를 req 객체에 저장
    next();
  } catch (error) {
    res.clearCookie("token"); // 유효하지 않은 토큰이면 쿠키 삭제
    res.redirect("/login");
  }
};

module.exports = authMiddleware;
