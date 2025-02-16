const express = require("express");
const router = express.Router();
const Food = require("../models/food.model.js");

// find all food
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find();
    res.render("foods/index", { foods: foods });
  } catch (error) {
    res.status(500).render("error", { message: error.message });
  }
});

// show food create page
router.get("/create", (req, res) => {
  res.render("foods/create");
});

// find one food
router.get("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (food) {
      return res.render("foods/show", { food: food });
    } else {
      return res.render("error", { message: "음식을 찾을 수 없습니다" });
    }
  } catch (error) {
    return res.status(500).render("error", { message: error.message });
  }
});

// food create
router.post("/create", async (req, res) => {
  try {
    console.log("Received form data:", req.body);
    const food = new Food({
      name: req.body.name,
      description: req.body.description,
      expiryDate: req.body.expiryDate,
    });

    const savedFood = await food.save();
    console.log("\n\nSaved food:", savedFood);
    res.redirect("/foods");
  } catch (error) {
    console.error("Error:", error);
    res.render("foods/create", {
      error: error.message,
      food: req.body,
    });
  }
});

module.exports = router;
