const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      url: String,
      filename: String, // Cloudinary에서 이미지를 식별/삭제할 때 쓰는 ID
    },
  },
  { timestamps: true },
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
