const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController.js");

// get food create page
router.get("/create", (req, res) => {
  try {
    res.render("foods/create");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// food create process
router.post("/create", async (req, res) => {
  try {
    const { name, description, expiryDate } = req.body;
    const userId = req.userId;
    await foodController.createFood(name, description, expiryDate, userId);
    res.redirect("/foods");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// find all food
router.get("/", async (req, res) => {
  try {
    const userId = req.userId;
    const foodList = await foodController.findAllFood(userId);
    res.render("foods/index", { foodList: foodList });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// find one food
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const food = await foodController.findOneFood(id);
    res.render("foods/detail", { food: food });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// get edit food page
router.get("/:id/edit", async (req, res) => {
  try {
    const id = req.params.id;
    const food = await foodController.findOneFood(id);
    res.render("foods/edit", { food: food });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// edit food process
router.put("/:id/edit", async (req, res) => {
  try {
    const id = req.params.id;
    const food = await foodController.findOneFood(id);

    if (!food) {
      res
        .status(404)
        .render("error", { message: "음식을 찾을 수 없습니다", layout: false });
    }

    const { name, description, expiryDate } = req.body;
    await foodController.updateOneFood(id, name, description, expiryDate);
    res.redirect(`/foods/${id}`);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// food delete process
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const food = await foodController.findOneFood(id);

    if (!food) {
      res
        .status(404)
        .render("error", { message: "음식을 찾을 수 없습니다", layout: false });
    }

    await foodController.deleteOneFood(id);
    res.redirect("/foods");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

module.exports = router;
