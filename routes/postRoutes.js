const express = require("express");
const router = express.Router();
const postController = require("../controllers/postContoller");

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
router.post("/create", async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.userId;
    const savedPost = await postController.createPost(title, content, userId);
    res.redirect(`/posts/${savedPost._id}`);
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
    const isAuthor = post.author._id.equals(req.userId);
    res.render("posts/detail", {
      post: post,
      author: post.author.username,
      isAuthor: isAuthor,
    });
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
router.put("/:id/edit", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await postController.findPostById(id);

    if (!post) {
      const error = new Error("게시물을 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }

    const { title, content } = req.body;
    await postController.updatePost(id, title, content);
    res.redirect(`/posts/${id}`);
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
