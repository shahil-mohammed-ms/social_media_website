const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User ID reference
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, // Post ID reference
  commentText: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of User ID references for likes
  likesCount: { type: Number, default: 0 }, // Likes count
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);
