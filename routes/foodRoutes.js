const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController.js");
const userController = require("../controllers/userController.js");
const groupController = require("../controllers/groupController.js");
const {
  cloudinary,
  CLOUDINARY_STORAGE_NAME,
} = require("../config/cloudinary.js");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB 제한 (RAM 보호)

// AI 이미지 분석
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

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, type, description, expiryAt, groupId } = req.body;
    const userId = req.userId;
    const fakeImage = { url: "uploading", filename: "uploading" }; // 업로드 중임을 표시하기 위한 가짜 이미지 객체
    const newFood = await foodController.createFood(
      name,
      type,
      description,
      expiryAt,
      userId,
      groupId === "nothing" ? null : groupId,
      fakeImage,
    );

    console.log(newFood);
    // 일단 클라이언트에게 응답
    if (groupId === "nothing") {
      res.redirect("/foods");
    } else {
      res.redirect(`/groups/${groupId}/foods`);
    }

    if (req.file) {
      const cldStream = cloudinary.uploader.upload_stream(
        { folder: CLOUDINARY_STORAGE_NAME },
        async (error, result) => {
          // callback 함수, cldStream.end() 후 실행됨.
          if (error) {
            console.error("Cloudinary 업로드 에러:", error);
            return;
          }

          // 업로드 성공 시 아까 만든 Food의 image 업데이트
          const image = { url: result.secure_url, filename: result.public_id };
          await foodController.updateFood(
            newFood._id,
            name,
            type,
            description,
            expiryAt,
            image,
          );
          console.log(`[ID: ${newFood._id}] 이미지 업로드 및 DB 업데이트 완료`);
        },
      );
      // buffer에 있는 이미지 파일을 cloudinary에 업로드
      cldStream.end(req.file.buffer);
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
router.put("/:id/edit", upload.single("image"), async (req, res) => {
  try {
    const id = req.params.id;
    const food = await foodController.findFoodById(id);

    if (!food) {
      const error = new Error("음식을 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }

    const { name, type, description, expiryAt } = req.body;
    const fakeImage = { url: "uploading", filename: "uploading" }; // 업로드 중임을 표시하기 위한 가짜 이미지 객체
    await foodController.updateFood(
      id,
      name,
      type,
      description,
      expiryAt,
      fakeImage,
    );

    // 일단 클라이언트에게 응답
    res.redirect(`/foods/${id}`);

    if (req.file) {
      const cldStream = cloudinary.uploader.upload_stream(
        { folder: CLOUDINARY_STORAGE_NAME },
        async (error, result) => {
          // callback 함수, cldStream.end() 후 실행됨.
          if (error) {
            console.error("Cloudinary 업로드 에러:", error);
            return;
          }

          // 업로드 성공 시 아까 업데이트한 Food의 image 업데이트
          const image = { url: result.secure_url, filename: result.public_id };
          await foodController.updateFood(
            id,
            name,
            type,
            description,
            expiryAt,
            image,
          );
          console.log(`[ID: ${id}] 이미지 업로드 및 DB 업데이트 완료`);
        },
      );
      // buffer에 있는 이미지 파일을 cloudinary에 업로드
      cldStream.end(req.file.buffer);
    }
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

    await foodController.deleteFood(id);
    res.redirect("/foods");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

module.exports = router;
