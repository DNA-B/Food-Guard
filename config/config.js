require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;
const SALT = parseInt(process.env.SALT);
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = { MONGO_URI, PORT, SALT, SECRET_KEY };
