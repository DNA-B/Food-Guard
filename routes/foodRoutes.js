const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController.js");
const userController = require("../controllers/userController.js");
const groupController = require("../controllers/groupController.js");
const { cloudinary, storage } = require("../config/cloudinary.js");
const multer = require("multer");
const upload = multer({ storage }); // storage 저장용 multer
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GEMINI_API_KEY } = require("../config/config.js");
const upload2 = multer(); // ai 분석용 multer

router.post("/analyze", upload2.single("image"), async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            type: { type: "string" },
          },
          required: ["type"],
        },
      },
    });

    if (!req.file) {
      return res.status(400).json({ error: "이미지가 없습니다." });
    }

    const base64ImageData = req.file.buffer.toString("base64");
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: base64ImageData,
        },
      },
      { text: "음식의 종류를 한국어로 분석해서 반환." },
    ]);

    const responseText = result.response.candidates[0].content.parts[0].text;
    console.log(responseText);
    res.json(JSON.parse(responseText));
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "분석 실패", detail: error.message });
  }
});

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
 *         multipart/form-data:
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
 *               image:
 *                 type: string
 *                 format: binary
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
    const groups = await groupController.findAllGroupByUserId(req.userId);
    res.render("foods/edit", { food: food, groups: groups });
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
 *       404:
 *         description: 음식을 찾을 수 없음
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
