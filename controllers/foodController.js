const Food = require("../models/foodModel");

const createFood = async (name, description, expiryDate, userId) => {
  const newFood = new Food({
    name: name,
    description: description,
    expiryDate: expiryDate,
    userId: userId,
  });

  const savedFood = await newFood.save();
  console.log("Saved food:", savedFood);
};

const findAllFood = async () => {
  const findFoods = await Food.find();
  return findFoods;
};

const findOneFood = async (id) => {
  const findFood = await Food.findById(id);
  return findFood;
};

const updateOneFood = async (id, name, description, expiryDate) => {
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
  await Food.deleteOne({ _id: id });
  console.log("Delete data - id: ", id);
};

module.exports = {
  createFood,
  findAllFood,
  findOneFood,
  updateOneFood,
  deleteOneFood,
};
