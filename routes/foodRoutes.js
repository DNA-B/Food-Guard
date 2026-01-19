const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController.js");
const userController = require("../controllers/userController.js");
const groupController = require("../controllers/groupController.js");
const { cloudinary, storage } = require("../config/cloudinary"); // 방금 만든 파일 불러오기
const multer = require("multer");
const upload = multer({ storage }); // multer 설정

/**
 * @swagger
 * /foods/create:
 *   get:
 *     summary: Get food create page
 *     tags:
 *       - Food
 *     responses:
 *       200:
 *         description: Create food page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /foods/create:
 *   post:
 *     summary: Create a new food
 *     tags:
 *       - Food
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               expiryAt:
 *                 type: string
 *               groupId:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to foods or group foods
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, description, expiryAt, groupId } = req.body;
    const userId = req.userId;
    const image = req.file
      ? { url: req.file.path, filename: req.file.filename }
      : null;

    await foodController.createFood(
      name,
      description,
      expiryAt,
      userId,
      groupId === "nothing" ? null : groupId,
      image,
    );

    if (groupId === "nothing") {
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

/**
 * @swagger
 * /foods:
 *   get:
 *     summary: Find all foods
 *     tags:
 *       - Food
 *     responses:
 *       200:
 *         description: Foods list page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.userId;
    const findUser = await userController.findUserById(userId);
    const foods = await foodController.findAllFoodByUserId(userId);
    res.render("foods/index", {
      nickname: findUser.nickname,
      foods: foods,
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /foods/{id}:
 *   get:
 *     summary: Find one food
 *     tags:
 *       - Food
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Food detail page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const food = await foodController.findFoodById(id);
    const isOwner = food.user._id.equals(req.userId);
    res.render("foods/detail", {
      food,
      foodAuthor: food.user.username,
      groupName: food.group ? food.group.name : "없음",
      isOwner: isOwner,
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /foods/{id}/edit:
 *   get:
 *     summary: Get edit food page
 *     tags:
 *       - Food
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Edit food page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /foods/{id}/edit:
 *   put:
 *     summary: Edit food
 *     tags:
 *       - Food
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               expiryAt:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to food detail
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.put("/:id/edit", async (req, res) => {
  try {
    const id = req.params.id;
    const food = await foodController.findFoodById(id);

    if (!food) {
      const error = new Error("음식을 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
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

/**
 * @swagger
 * /foods/{id}/eat:
 *   put:
 *     summary: Mark food as eaten
 *     tags:
 *       - Food
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to foods
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.put("/:id/eat", async (req, res) => {
  try {
    const id = req.params.id;
    const food = await foodController.findFoodById(id);

    if (!food) {
      const error = new Error("음식을 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }

    await foodController.eatFood(id);
    res.redirect("/foods");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /foods/{id}:
 *   delete:
 *     summary: Delete food
 *     tags:
 *       - Food
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to foods
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const food = await foodController.findFoodById(id);

    if (!food) {
      const error = new Error("음식을 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }

    if (food.image && food.image.filename) {
      await cloudinary.uploader.destroy(food.image.filename); // 클라우드에서 실제 파일 삭제
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
