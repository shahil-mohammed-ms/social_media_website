var express = require("express");
const multer = require("multer");
var router = express.Router();
const mongoose = require("mongoose");
const ProfileDetails = require("../src/Database/SchemaModel/profileDetailsSchema");
const Post = require("../src/Database/SchemaModel/postSchema");
const User = require("../src/Database/SchemaModel/signupSchema");

//Home//

router.get("/", async (req, res) => {
  try {
    const sessionid = req.session.user.id;

    const profile = await ProfileDetails.findOne({ UID: sessionid });
    const followingIds = await profile.following.map(
      (following) => following.followingId
    );

    const posts = await Post.find({ userId: { $in: followingIds } })
      .sort({ createdAt: -1 }) // Sort by descending createdAt
      .exec();
    const postsWithUserDetails = await Promise.all(
      posts.map(async (post) => {
        const user = await ProfileDetails.findOne({ UID: post.userId });
        return {
          id: post._id,
          title: post.title,
          description: post.description,
          imageUrl: post.imageUrl,
          likes: post.likes,
          likesCount: post.likesCount,
          comments: post.comments,
          createdAt: post.createdAt,
          postedBy: {
            nickName: user.nickName,
            profileUrl: user.profileUrl,
            userId: user.UID,
          },
        };
      })
    );

    res.json(postsWithUserDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Profile
router.get("/profile", (req, res) => {
  try {
    res.status(200).json(req.session);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

// profile details
router.post("/profileDetails", async (req, res) => {
  try {
    const UID = req.session.user.id;
    const profile = await ProfileDetails.findOneAndUpdate(
      { UID },
      {
        nickName: req.body.nickName,
        details: req.body.details,
        phone: req.body.phone,
        profileUrl: req.body.profileUrl,
        UID,
      }
    );

    res.json({ message: "details created successfully" });
  } catch (e) {
    console.log(e);
  }
});
//get profile details
router.get("/profileDetails", async (req, res) => {
  try {
    const profile_details = await ProfileDetails.findOne({
      UID: req.session.user.id,
    });
    res.json(profile_details);
  } catch (e) {
    res.json(e);
  }
});

// Find the profile details document using UID as filter
router.post("/profileDetailsUpdate", async (req, res) => {
  const UID = req.session.user.id;
  const profile = await ProfileDetails.findOneAndUpdate(
    { UID },
    {
      nickName: req.body.nickName,
      details: req.body.details,
      UID,
    }
  );

  // Send response with updated profile details
  res.json({ message: "Profile details updated successfully", profile });
});

// Define Multer storage options

var Storage = multer.diskStorage({
  destination: "./public/images/profile_picture",
  filename: (req, file, cb) => {
    // Extract the original file extension
    const fileExtension = file.originalname.split(".").pop();

    // Generate a unique filename based on the current timestamp
    const uniqueFilename = `${Date.now()}.${fileExtension}`;

    // Set the filename for storing the image
    cb(null, uniqueFilename);
  },
});

var upload = multer({
  storage: Storage,
});
//upload profile picture

router.post("/profileAvatar", upload.single("avatar"), async (req, res) => {
  try {
    const file = req.file.filename;

    const UID = req.session.user.id;

    const profile = await ProfileDetails.findOneAndUpdate(
      { UID },
      {
        profileUrl: file,
        UID,
      }
    );

    // Send response with updated profile details
    res.json({ message: "Profile photo updated successfully", profile });

    //
  } catch (e) {
    console.log(e);
  }
});

router.get("/profilePage/:UID", async (req, res) => {
  try {
    console.log(req.params.UID);
    const userId = new mongoose.Types.ObjectId(req.params.UID);
    const profile_details = await ProfileDetails.findOne({ UID: userId });
    console.log("profile_details");
    res.json(profile_details);
  } catch (e) {
    res.json(e);
  }
});

router.put("/profileUpdate", upload.single("avatar"), async (req, res) => {
  try {
    const UID = req.session.user.id;
    // Access the updated profile data from req.body
    const { nickName, details, phone } = req.body;

    // Check if a file was uploaded
    if (req.file && req.file.filename) {
      const profileImage = req.file.filename;
      const profile = await ProfileDetails.findOneAndUpdate(
        { UID },
        {
          nickName,
          details,
          phone,
          profileUrl: profileImage,
          UID,
        }
      );
    } else {
      const profile = await ProfileDetails.findOneAndUpdate(
        { UID },
        {
          nickName,
          details,
          phone,
          UID,
        }
      );
    }

    res.status(200).json({ message: "Profile details updated successfully" });
  } catch (error) {
    console.error("Error updating profile details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating profile details" });
  }
});

//  friends details
router.get("/friendDetails/:friendId", async (req, res) => {
  try {
    const UID = req.params.friendId;

    const profile = await ProfileDetails.findOne({ UID });

    res.status(200).json(profile);
  } catch (e) {
    console.log(e);
  }
});
// get realname
router.get("/realName/:userId", async (req, res) => {
  try {
    const nameDetails = await User.findById(req.params.userId);
    res.status(200).json(nameDetails);
  } catch (e) {
    console.log(e);
  }
});

// for search users

router.get("/search", async (req, res) => {
  const searchTerm = req.query.term;
  try {
    const profile = await ProfileDetails.find({ nickName: searchTerm });

    res.json(profile);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
