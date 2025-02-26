require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;
const SALT = parseInt(process.env.SALT);

module.exports = { MONGO_URI, PORT, SALT };
