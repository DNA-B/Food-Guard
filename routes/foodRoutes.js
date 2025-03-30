const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController.js");

// find all food
router.get("/", async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId);
    const foodList = await foodController.findAllFood(userId);
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
    const { name, description, expiryDate } = req.body;
    const userId = req.userId;
    await foodController.createFood(name, description, expiryDate, userId);
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
    const food = await foodController.findOneFood(req.params.id);

    if (food) {
      res.render("foods/show", { food: food });
    } else {
      res.render("error", { error: "음식을 찾을 수 없습니다" });
    }
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

// edit food view
router.get("/:id/edit", async (req, res) => {
  try {
    const food = await foodController.findOneFood(req.params.id);

    if (food) {
      res.render("foods/edit", { food: food });
    } else {
      res.render("error", { error: "음식을 찾을 수 없습니다" });
    }
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

// edit food
router.put("/:id/edit", async (req, res) => {
  try {
    const food = await foodController.findOneFood(req.params.id);

    if (food) {
      const { name, description, expiryDate } = req.body;
      await foodController.updateOneFood(
        req.params.id,
        name,
        description,
        expiryDate
      );
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
    const food = await foodController.findOneFood(req.params.id);

    if (food) {
      await foodController.deleteOneFood(req.params.id);
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
