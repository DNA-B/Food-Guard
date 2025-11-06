const Post = require("../models/postModel");

const createPost = async (title, content, userId) => {
  if (!title) {
    const error = new Error("필수 조건을 모두 입력해주세요.");
    error.statusCode = 422;
    throw error;
  }

  const newPost = new Post({
    title: title,
    content: content,
    author: userId,
  });

  const savedPost = await newPost.save();
  console.log("Saved Post:", savedPost);
  return savedPost;
};

const findAllPost = async () => {
  const findPosts = await Post.find();

  if (!findPosts) {
    const error = new Error("게시물을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return findPosts;
};

const findPostById = async (id) => {
  const findPost = await Post.findById(id).populate("author", "username");

  if (!findPost) {
    const error = new Error("게시물을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return findPost;
};

const updatePost = async (id, title, content) => {
  if (!id) {
    const error = new Error("게시물을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  await Post.updateOne(
    { _id: id }, // filter
    {
      // update field
      title: title,
      content: content,
    }
  );
};

const deletePost = async (id) => {
  const post = await Post.findById(id);

  if (!post) {
    const error = new Error("게시물을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  await Post.deleteOne({ _id: id });
};

module.exports = {
  createPost,
  findAllPost,
  findPostById,
  updatePost,
  deletePost,
};
