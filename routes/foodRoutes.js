const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController.js");
const groupController = require("../controllers/groupController.js");

// get food create page
router.get("/create", async (req, res) => {
  try {
    const userId = req.userId;
    const groups = await groupController.findAllGroupByUserId(userId);
    res.render("foods/create", { groups });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// food create process
router.post("/create", async (req, res) => {
  try {
    // TODO
    // user can input 'Hour'

    const { name, description, expiryAt, groupId } = req.body;
    const userId = req.userId;
    await foodController.createFood(
      name,
      description,
      expiryAt,
      userId,
      groupId === "" ? null : groupId
    );

    if (groupId === "") {
      // 빈 문자열이면 나눔 페이지에서 생성된 음식
      res.redirect("/foods");
    } else {
      res.redirect(`/groups/${groupId}/foods`);
    }
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
    const foodList = await foodController.findAllFoodByUserId(userId);
    res.render("foods/index", { foodList: foodList });
  } catch (error) {
    console.log("던져진 오류:", error.message, error.statusCode); // 디버깅
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// find one food
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const food = await foodController.findFoodById(id);
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
    const food = await foodController.findFoodById(id);
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
    const food = await foodController.findFoodById(id);

    if (!food) {
      res
        .status(404)
        .render("error", { message: "음식을 찾을 수 없습니다", layout: false });
    }

    const { name, description, expiryAt } = req.body;
    await foodController.updateFood(id, name, description, expiryAt);
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
    const food = await foodController.findFoodById(id);

    if (!food) {
      res
        .status(404)
        .render("error", { message: "음식을 찾을 수 없습니다", layout: false });
    }

    await foodController.deleteFood(id);
    res.redirect("/foods");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

module.exports = router;
