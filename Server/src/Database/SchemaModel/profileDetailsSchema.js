const mongoose = require("mongoose");

const ProfileDetailsSchema = mongoose.Schema({
  nickName: {
    type: String,
    default: "",
  },
  details: {
    type: String,
  },
  UID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  followers: [
    {
      followersId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
      },
    },
  ],
  followersCount: {
    type: Number,
    default: 0,
  },
  following: [
    {
      followingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
      },
    },
  ],
  followingCount: {
    type: Number,
    default: 0,
  },
  posts: [
    {
      postIds: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],
  phone: {
    type: String,
    required: true,
    default: "",
  },
  profileUrl: {
    type: String,
    default: "",
  },
});

const ProfileDetails = mongoose.model("ProfileDetails", ProfileDetailsSchema);

module.exports = ProfileDetails;
