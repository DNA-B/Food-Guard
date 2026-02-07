const { Food, FOOD_STATUS } = require("../models/foodModel");
const { cloudinary } = require("../config/cloudinary.js");

const createFood = async (name, type, description, expiryAt, userId, groupId, image) => {
  if (!name) {
    const error = new Error("필수 조건을 모두 입력해주세요.");
    error.statusCode = 422;
    throw error;
  }

  const newFood = new Food({
    name: name,
    type: type,
    description: description,
    expiryAt: expiryAt,
    user: userId,
    group: groupId,
    image: image,
  });

  return await newFood.save();
};

const findAllFoodByUserId = async (userId) => {
  const foods = await Food.find({
    user: userId,
    status: FOOD_STATUS.AVAILABLE,
  });

  if (!foods) {
    const error = new Error("음식을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return foods;
};

const findAllFoodByGroupId = async (groupId) => {
  const foods = await Food.find({
    group: groupId,
    status: FOOD_STATUS.AVAILABLE,
  });

  if (!foods) {
    const error = new Error("음식을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return foods;
};

const findFoodById = async (id) => {
  const food = await Food.findById(id)
    .populate("user", "username") // user.username 만
    .populate("group", "name"); // group.name 만 (group 이 null 이면 null)

  if (!food) {
    const error = new Error("음식을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return food;
};

const updateFood = async (id, name, type, description, expiryAt, image) => {
  const food = await Food.findById(id);

  if (!food) {
    const error = new Error("음식을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  if (image) {
    if (image.url !== "uploading" && image.filename !== "uploading") {
      // 이미지가 없는 상태에서, 업로딩 상태면 나중에 update 한 번 더 들어올 때 삭제되므로 예외 처리
      if (food.image.url && food.image.filename && food.image.filename !== image.filename) {
        await cloudinary.uploader.destroy(food.image.filename); // 클라우드에서 실제 파일 삭제
        console.log(`cloudinary ${food.image.filename} - deleted`);
      }
    }

    food.image = {
      url: image.url,
      filename: image.filename === "uploading" ? food.image.filename : image.filename,
    }; // filename으로 기존 이미지 삭제해야 할 수 있기 때문에 uploading인 경우, 기존 이미지 이름을 가져간다.
  }

  food.name = name;
  food.type = type;
  food.description = description;
  food.expiryAt = expiryAt;

  return await food.save();
};

const eatFood = async (id) => {
  const food = await Food.findById(id);

  if (!food) {
    const error = new Error("음식을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  food.status = FOOD_STATUS.CONSUMED;
  await food.save();
};

const deleteFood = async (id) => {
  const food = await Food.findById(id);

  if (!food) {
    const error = new Error("음식을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  if (food.image && food.image.filename) {
    await cloudinary.uploader.destroy(food.image.filename); // 클라우드에서 실제 파일 삭제
    console.log(`cloudinary ${food.image.filename}- deleted`);
  }

  await food.deleteOne();
};

module.exports = {
  createFood,
  findAllFoodByUserId,
  findAllFoodByGroupId,
  findFoodById,
  updateFood,
  eatFood,
  deleteFood,
};
