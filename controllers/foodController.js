const Food = require("../models/foodModel");

const createFood = async (name, description, expiryDate, userId) => {
  try {
    if (!name) {
      res.status(422).render("error", {
        message: "필수 조건을 모두 입력해주세요.",
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
  } catch (error) {
    res.status(500).render("error", { message: error.message });
  }
};

const findAllFood = async (userId) => {
  try {
    const findFoods = await Food.find({ user: userId });

    if (!findFoods) {
      res.status(404).render("error", { message: "음식을 찾을 수 없습니다." });
    }

    return findFoods;
  } catch (error) {
    res.status(500).render("error", { message: error.message });
  }
};

const findOneFood = async (id) => {
  try {
    const findFood = await Food.findById(id);

    if (!findFood) {
      res.status(404).render("error", { message: "음식을 찾을 수 없습니다." });
    }

    return findFood;
  } catch (error) {
    res.status(500).render("error", { message: error.message });
  }
};

const updateOneFood = async (id, name, description, expiryDate) => {
  try {
    if (!id) {
      res.status(404).render("error", { message: "음식을 찾을 수 없습니다." });
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
  } catch (error) {
    res.status(500).render("error", { message: error.message });
  }
};

const deleteOneFood = async (id) => {
  try {
    const food = Food.findById(id);

    if (!food) {
      res.status(404).render("error", { messga: "음식을 찾을 수 없습니다." });
    }

    await Food.deleteOne(food);
    console.log("Delete Food - id: ", id);
  } catch (error) {
    res.status(500).render("error", { message: error.message });
  }
};

module.exports = {
  createFood,
  findAllFood,
  findOneFood,
  updateOneFood,
  deleteOneFood,
};
