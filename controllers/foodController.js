const Food = require("../models/foodModel");

const createFood = async (name, description, expiryAt, userId, groupId) => {
  if (!name) {
    const error = new Error("필수 조건을 모두 입력해주세요.");
    error.statusCode = 422;
    throw error;
  }

  const newFood = new Food({
    name: name,
    description: description,
    expiryAt: expiryAt,
    user: userId,
    group: groupId,
  });

  await newFood.save();
};

const findAllFoodByUserId = async (userId) => {
  const foods = await Food.find({
    user: userId,
    isConsumed: false,
    isDonated: false,
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
    isConsumed: false,
    isDonated: false,
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

const updateFood = async (id, name, description, expiryAt) => {
  const food = await Food.findById(id);

  if (!food) {
    const error = new Error("음식을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  food.name = name;
  food.description = description;
  food.expiryAt = expiryAt;
  await food.save();
};

const eatFood = async (id) => {
  const food = await Food.findById(id);

  if (!food) {
    const error = new Error("음식을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  food.isConsumed = true;
  await food.save();
};

const deleteFood = async (id) => {
  const food = await Food.findById(id);

  if (!food) {
    const error = new Error("음식을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
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
