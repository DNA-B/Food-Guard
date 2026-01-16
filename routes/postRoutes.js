const express = require("express");
const router = express.Router();
const postController = require("../controllers/postContoller");

// get post create page
router.get("/create", async (req, res) => {
  try {
    res.render("posts/create");
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// post create process
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

// find all post
router.get("/", async (req, res) => {
  try {
    const postList = await postController.findAllPost();
    res.render("posts/index", { postList });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .render("error", { message: error.message, layout: false });
  }
});

// find one post
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await postController.findPostById(id);
    const isAuthor = req.userId === post.author._id.toString();
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

// get edit post page
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

// edit post process
router.put("/:id/edit", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await postController.findPostById(id);

    if (!post) {
      res.status(404).render("error", {
        message: "게시물을 찾을 수 없습니다",
        layout: false,
      });
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

// post delete process
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await postController.findPostById(id);

    if (!post) {
      res.status(404).render("error", {
        message: "게시물을 찾을 수 없습니다",
        layout: false,
      });
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
