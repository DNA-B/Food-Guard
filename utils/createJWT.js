const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/config.js");

const generateToken = (user) => {
  const payload = { _id: user._id };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "30m" });
};

module.exports = generateToken;
