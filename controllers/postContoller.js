const Post = require("../models/postModel");
const { COMMENT_STATUS, Comment } = require("../models/commentModel");
const { cloudinary } = require("../config/cloudinary.js");

const createPost = async (title, content, userId, image) => {
  if (!title) {
    const error = new Error("필수 조건을 모두 입력해주세요.");
    error.statusCode = 422;
    throw error;
  }

  const newPost = new Post({
    title: title,
    content: content,
    author: userId,
    image: image,
  });

  const savedPost = await newPost.save();
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

const updatePost = async (id, title, content, image) => {
  const post = await Post.findById(id);

  if (!post) {
    const error = new Error("게시물을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  if (
    post.image &&
    post.image.filename &&
    !post.image.equals(image) &&
    image.url !== "uploading" // 이미 이미지가 있는 상황에서, 업로딩 상태면 나중에 update 한 번 더 들어올 때 삭제되므로 예외 처리
  ) {
    await cloudinary.uploader.destroy(post.image.filename); // 클라우드에서 실제 파일 삭제
    console.log(`cloudinary ${post.image.filename}- deleted`);
  }

  post.title = title;
  post.content = content;
  post.image = image;
  await post.save();
};

const deletePost = async (id) => {
  const post = await Post.findById(id);

  if (!post) {
    const error = new Error("게시물을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  if (post.image && post.image.filename) {
    await cloudinary.uploader.destroy(post.image.filename); // 클라우드에서 실제 파일 삭제
    console.log(`cloudinary ${post.image.filename}- deleted`);
  }

  await post.deleteOne();
};

const findAllCommentsByPostId = async (postId) => {
  const comments = await Comment.find({ post: postId })
    .populate("author", "username")
    .populate("parentComment");

  if (!comments) {
    const error = new Error("댓글을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return comments;
};

const createComment = async (postId, userId, content) => {
  if (!content) {
    const error = new Error("필수 조건을 모두 입력해주세요.");
    error.statusCode = 422;
    throw error;
  }

  const newComment = new Comment({
    post: postId,
    author: userId,
    content: content,
  });

  await newComment.save();
};

const replyComment = async (postId, userId, content, commentId) => {
  if (!content) {
    const error = new Error("필수 조건을 모두 입력해주세요.");
    error.statusCode = 422;
    throw error;
  }

  const newComment = new Comment({
    post: postId,
    author: userId,
    content: content,
    parentComment: commentId,
  });

  await newComment.save();
};

const deleteComment = async (commentId) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    const error = new Error("댓글을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  comment.status = COMMENT_STATUS.DELETED;
  await comment.save();
};

module.exports = {
  createPost,
  findAllPost,
  findPostById,
  updatePost,
  deletePost,
  findAllCommentsByPostId,
  createComment,
  replyComment,
  deleteComment,
};
