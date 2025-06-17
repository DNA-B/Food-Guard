const Food = require("../models/foodModel");

const createFood = async (name, description, expiryAt, userId, groupId) => {
  if (!name) {
    throw new Error({
      message: "필수 조건을 모두 입력해주세요.",
      statusCode: 422,
    });
  }

  const newFood = new Food({
    name: name,
    description: description,
    expiryAt: expiryAt,
    user: userId,
    group: groupId,
  });

  const savedFood = await newFood.save();
  console.log("Saved food:", savedFood);
};

const findAllFoodByUserId = async (userId) => {
  const findFoods = await Food.find({ user: userId });

  if (!findFoods) {
    throw new Error({ message: "음식을 찾을 수 없습니다.", statusCode: 404 });
  }

  return findFoods;
};

const findAllFoodByGroupId = async (groupId) => {
  const findFoods = await Food.find({ group: groupId });

  if (!findFoods) {
    throw new Error({ message: "음식을 찾을 수 없습니다.", statusCode: 404 });
  }

  return findFoods;
};

const findOneFood = async (id) => {
  const findFood = await Food.findById(id);

  if (!findFood) {
    throw new Error({ message: "음식을 찾을 수 없습니다.", statusCode: 404 });
  }

  return findFood;
};

const updateOneFood = async (id, name, description, expiryAt) => {
  if (!id) {
    throw new Error({ message: "음식을 찾을 수 없습니다.", statusCode: 404 });
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
    throw new Error({ message: "음식을 찾을 수 없습니다.", statusCode: 404 });
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
