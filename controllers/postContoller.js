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
  const posts = await Post.find();

  if (!posts) {
    const error = new Error("게시물을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return posts;
};

const findPostById = async (id) => {
  const post = await Post.findById(id).populate("author", "username");

  if (!post) {
    const error = new Error("게시물을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return post;
};

const updatePost = async (id, title, content) => {
  const post = await Post.findById(id);

  if (!post) {
    const error = new Error("게시물을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  post.title = title;
  post.content = content;
  await post.save();
};

const deletePost = async (id) => {
  const post = await Post.findById(id);

  if (!post) {
    const error = new Error("게시물을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  await post.deleteOne();
};

module.exports = {
  createPost,
  findAllPost,
  findPostById,
  updatePost,
  deletePost,
};
