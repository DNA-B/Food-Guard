const bcrypt = require("bcrypt");

const bcryptHash = async (raw) => {
  const SALT = await bcrypt.genSalt();
  return await bcrypt.hash(raw, SALT);
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { bcryptHash, comparePassword };
