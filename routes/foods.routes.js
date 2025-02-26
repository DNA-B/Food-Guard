const express = require("express");

const router = express.Router();
const Food = require("../models/food.model.js");

// find all food
router.get("/", async (req, res) => {
  try {
    const foodList = await Food.find();
    if (foodList) {
      res.render("foods/index", { foodList: foodList });
    } else {
      res.render("error", { error: "음식을 찾을 수 없습니다" });
    }
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

// food create
router.post("/create", async (req, res) => {
  try {
    console.log("Received form data: ", req.body);
    const food = new Food({
      name: req.body.name,
      description: req.body.description,
      expiryDate: req.body.expiryDate,
    });

    const savedFood = await food.save();
    console.log("Saved food:", savedFood);
    res.redirect("/foods");
  } catch (error) {
    console.error("Error:", error);
    res.render("foods/create", {
      error: error.message,
      food: req.body,
    });
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
    console.log("food: ", food);

    if (food) {
      res.render("foods/show", { food: food });
    } else {
      res.render("error", { error: "음식을 찾을 수 없습니다" });
    }
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

// find one food
router.get("/:id/edit", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    console.log("food: ", food);

    if (food) {
      res.render("foods/edit", { food: food });
    } else {
      res.render("error", { error: "음식을 찾을 수 없습니다" });
    }
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

router.put("/:id/edit", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (food) {
      const newFood = {
        name: req.body.name,
        description: req.body.description,
        expiryDate: req.body.expiryDate,
      };
      await food.updateOne(newFood);
      res.redirect("/foods");
    } else {
      res.render("error", { error: "음식을 찾을 수 없습니다" });
    }
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    console.log("Delete data [id - ", req.params, "]");
    const food = await Food.findById(req.params.id);

    if (food) {
      const deletedFood = await Food.deleteOne(food);
      console.log("Deleted Data: ", deletedFood);
      res.redirect("/foods");
    } else {
      res.render("error", { error: "음식을 찾을 수 없습니다" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.render("foods/show", {
      error: error.message,
      food: req.body,
    });
  }
});

module.exports = router;
