const express = require("express");
const router = express.Router();
const postController = require("../controllers/postContoller");
const {
  cloudinary,
  CLOUDINARY_STORAGE_NAME,
} = require("../config/cloudinary.js");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB 제한 (RAM 보호)

/**
 * @swagger
 * /posts/create:
 *   get:
 *     summary: Get post create page
 *     tags:
 *       - Post
 *     responses:
 *       200:
 *         description: Create post page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/create", async (req, res) => {
  try {
    res.render("posts/create");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /posts/create:
 *   post:
 *     summary: Create a new post
 *     tags:
 *       - Post
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - title
 *               - content
 *     responses:
 *       302:
 *         description: Redirect to post detail
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.userId;
    const fakeImage = { url: "uploading", filename: null }; // 업로드 중임을 표시하기 위한 가짜 이미지 객체
    const savedPost = await postController.createPost(
      title,
      content,
      userId,
      fakeImage,
    );

    res.redirect(`/posts/${savedPost._id}`);

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
          await postController.updatePost(savedPost._id, title, content, image);
          console.log(
            `[ID: ${savedPost._id}] 이미지 업로드 및 DB 업데이트 완료`,
          );
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
 * /posts:
 *   get:
 *     summary: Find all posts
 *     tags:
 *       - Post
 *     responses:
 *       200:
 *         description: Posts list page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const posts = await postController.findAllPost();
    res.render("posts/index", { posts });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Find one post
 *     tags:
 *       - Post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post detail page
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
    const post = await postController.findPostById(id);
    const comments = await postController.findAllCommentsByPostId(id);
    const isAuthor = post.author._id.equals(req.userId);
    res.render("posts/detail", {
      post: post,
      author: post.author.username,
      comments: comments,
      isAuthor: isAuthor,
      userId: req.userId,
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

router.post("/:id/comments", async (req, res) => {
  try {
    const { "comment-content": content } = req.body;
    postController.createComment(req.params.id, req.userId, content);
    res.redirect(`/posts/${req.params.id}`);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

router.post("/:id/comments/:comment_id/reply", async (req, res) => {
  try {
    const { "comment-content": content } = req.body;
    postController.replyComment(
      req.params.id,
      req.userId,
      content,
      req.params.comment_id,
    );
    res.redirect(`/posts/${req.params.id}`);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

router.delete("/:id/comments/:comment_id", async (req, res) => {
  try {
    await postController.deleteComment(req.params.comment_id);
    res.redirect(`/posts/${req.params.id}`);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /posts/{id}/edit:
 *   get:
 *     summary: Get edit post page
 *     tags:
 *       - Post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Edit post page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 */
router.get("/:id/edit", async (req, res) => {
  try {
    const post = await postController.findPostById(req.params.id);
    res.render("posts/edit", { post: post });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

/**
 * @swagger
 * /posts/{id}/edit:
 *   put:
 *     summary: Edit post
 *     tags:
 *       - Post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to post detail
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
    const post = await postController.findPostById(id);

    if (!post) {
      const error = new Error("게시물을 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }

    const { title, content } = req.body;
    const fakeImage = { url: "uploading", filename: null }; // 업로드 중임을 표시하기 위한 가짜 이미지 객체
    await postController.updatePost(id, title, content, fakeImage);

    res.redirect(`/posts/${id}`);

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
          await postController.updatePost(id, title, content, image);
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
 * /posts/{id}:
 *   delete:
 *     summary: Delete post
 *     tags:
 *       - Post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to posts
 *         headers:
 *           Location:
 *             schema:
 *               type: string
 *       500:
 *         description: Server error
 *       404:
 *         description: Post not found
 */
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await postController.findPostById(id);

    if (!post) {
      const error = new Error("게시물을 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }

    await postController.deletePost(id);
    res.redirect("/posts");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

module.exports = router;
