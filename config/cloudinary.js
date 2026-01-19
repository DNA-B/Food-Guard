const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// 1. Cloudinary 기본 설정
console.log(process.env.CLOUDINARY_STORAGE_NAME);
console.log(process.env.CLOUDINARY_API_KEY);
console.log(process.env.CLOUDINARY_API_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_STORAGE_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Multer 전용 저장소(Storage) 설정
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "food-guard-img", // Cloudinary 대시보드에 생성될 폴더 이름
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
