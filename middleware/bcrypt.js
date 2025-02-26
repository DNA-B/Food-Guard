const bcrypt = require("bcrypt");
const { SALT } = require("../config/config");

async function bcryptHash(raw) {
  return await bcrypt.hash(raw, SALT);
}

module.exports = { bcryptHash };
