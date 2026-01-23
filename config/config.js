require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  SECRET_KEY: process.env.SECRET_KEY,
  MONGO_URI: process.env.MONGO_URI,
  CLOUDINARY_STORAGE_NAME: process.env.CLOUDINARY_STORAGE_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};
