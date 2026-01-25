const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/config.js");

const generateToken = (user) => {
  const payload = { _id: user._id };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
};

module.exports = generateToken;
