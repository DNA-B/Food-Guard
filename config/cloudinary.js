const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { CLOUDINARY_STORAGE_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = require("./config.js");

// 1. Cloudinary 기본 설정
cloudinary.config({
  cloud_name: CLOUDINARY_STORAGE_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

/*
// 2. Multer 전용 저장소(Storage) 설정
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: CLODUINARY_FOLDER_NAME, // Cloudinary 대시보드에 생성될 폴더 이름
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
*/

module.exports = {
  cloudinary,
  CLOUDINARY_STORAGE_NAME,
  // storage,
};
