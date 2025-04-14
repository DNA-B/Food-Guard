const Food = require("../models/foodModel");

const createFood = async (name, description, expiryDate, userId) => {
  if (!name) {
    throw new Error({
      message: "필수 조건을 모두 입력해주세요.",
      statusCode: 422,
    });
  }

  const newFood = new Food({
    name: name,
    description: description,
    expiryDate: expiryDate,
    user: userId,
  });

  const savedFood = await newFood.save();
  console.log("Saved food:", savedFood);
};

const findAllFood = async (userId) => {
  const findFoods = await Food.find({ user: userId });

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

const updateOneFood = async (id, name, description, expiryDate) => {
  if (!id) {
    throw new Error({ message: "음식을 찾을 수 없습니다.", statusCode: 404 });
  }

  await Food.updateOne(
    { _id: id }, // filter
    {
      // update field
      name: name,
      description: description,
      expiryDate: expiryDate,
    }
  );
};

const deleteOneFood = async (id) => {
  const food = Food.findById(id);

  if (!food) {
    throw new Error({ message: "음식을 찾을 수 없습니다.", statusCode: 404 });
  }

  await Food.deleteOne(food);
  console.log("Delete Food - id: ", id);
};

module.exports = {
  createFood,
  findAllFood,
  findOneFood,
  updateOneFood,
  deleteOneFood,
};
