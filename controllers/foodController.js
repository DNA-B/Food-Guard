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

  const savedFood = await newFood.save();
  console.log("Saved Food:", savedFood);
};

const findAllFoodByUserId = async (userId) => {
  const findFoods = await Food.find({ user: userId });

  if (findFoods) {
    const error = new Error("음식을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return findFoods;
};

const findAllFoodByGroupId = async (groupId) => {
  const findFoods = await Food.find({ group: groupId });

  if (!findFoods) {
    const error = new Error("음식을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return findFoods;
};

const findOneFood = async (id) => {
  const findFood = await Food.findById(id);

  if (!findFood) {
    const error = new Error("음식을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return findFood;
};

const updateOneFood = async (id, name, description, expiryAt) => {
  if (!id) {
    const error = new Error("음식을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  await Food.updateOne(
    { _id: id }, // filter
    {
      // update field
      name: name,
      description: description,
      expiryAt: expiryAt,
    }
  );
};

const deleteOneFood = async (id) => {
  const food = await Food.findById(id);

  if (!food) {
    const error = new Error("음식을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  await Food.deleteOne({ _id: id });
};

module.exports = {
  createFood,
  findAllFoodByUserId,
  findAllFoodByGroupId,
  findOneFood,
  updateOneFood,
  deleteOneFood,
};
