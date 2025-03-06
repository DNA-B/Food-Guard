const bcrypt = require("bcrypt");
const { SALT } = require("../config/config");

const bcryptHash = async (raw) => {
  return await bcrypt.hash(raw, SALT);
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { bcryptHash, comparePassword };
