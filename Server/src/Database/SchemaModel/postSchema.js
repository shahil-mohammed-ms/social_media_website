const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProfileDetails",
    required: true,
  },

  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: [{ type: String, required: true }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProfileDetails" }], // Array of User ID references
  likesCount: { type: Number, default: 0 }, // Likes count
  comments: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
