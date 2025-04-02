const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController.js");

// find all food
router.get("/", async (req, res) => {
  const userId = req.userId;
  const foodList = await foodController.findAllFood(userId);
  res.render("foods/index", { foodList: foodList });
});

// food create
router.post("/create", async (req, res) => {
  const { name, description, expiryDate } = req.body;
  const userId = req.userId;
  await foodController.createFood(name, description, expiryDate, userId);
  res.redirect("/foods");
});

// show food create page
router.get("/create", (req, res) => {
  res.render("foods/create");
});

// find one food
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const food = await foodController.findOneFood(id);
  res.render("foods/show", { food: food });
});

// edit food view
router.get("/:id/edit", async (req, res) => {
  const id = req.params.id;
  const food = await foodController.findOneFood(id);
  res.render("foods/edit", { food: food });
});

// edit food
router.put("/:id/edit", async (req, res) => {
  const id = req.params.id;
  const food = await foodController.findOneFood(id);

  if (!food) {
    res.status(404).render("error", { message: "음식을 찾을 수 없습니다" });
  }

  const { name, description, expiryDate } = req.body;
  await foodController.updateOneFood(
    req.params.id,
    name,
    description,
    expiryDate
  );
  res.redirect("/foods");
});

router.delete("/:id", async (req, res) => {
  const food = await foodController.findOneFood(req.params.id);

  if (!food) {
    res.status(404).render("error", { message: "음식을 찾을 수 없습니다" });
  }

  await foodController.deleteOneFood(req.params.id);
  res.redirect("/foods");
});

module.exports = router;
