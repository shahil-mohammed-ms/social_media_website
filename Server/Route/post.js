var express = require("express");
var router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const ProfileDetails = require("../src/Database/SchemaModel/profileDetailsSchema");
const Post = require("../src/Database/SchemaModel/postSchema");
const Comment = require("../src/Database/SchemaModel/postCommentSchema");
// Multer storage configuration
const path = require("path");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: "./public/images/post",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Multer upload configuration
const uploadpost = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit for file size
  },
}).array("files", 5); // You can specify the field name for multiple files, here 'files' and set the maximum number of files allowed, here 5

// Middleware function for handling file upload
const handleFileUpload = (req, res, next) => {
  // Add any necessary checks or validations here
  // For example, you can check if the user is authenticated, or validate the file format, etc.

  // Call the Multer upload function after performing necessary checks
  uploadpost(req, res, function (err) {
    if (err) {
      // Handle multer errors
      // For example, you can return an error response to the client
      return res.status(500).json({ error: err.message });
    }

    // Call the next middleware or route handler after successful file upload
    next();
  });
};

// POST route for uploading files
router.post("/", handleFileUpload, async function (req, res) {
  try {
    // Access the uploaded files in req.files array
    // Loop through the files array and perform any necessary operations, e.g. storing file information in the database
    const fileInfos = [];
    req.files.forEach((file) => {
      const fileInfo = {
        originalName: file.originalname,
        fileName: file.filename,
        mimeType: file.mimetype,
        size: file.size,
      };
      fileInfos.push(fileInfo);
    });

    // Create a new post in the database with the file information and other fields from req.body
    const { title, description, likes, likesCount, comments } = req.body;
    const imageUrls = [];
    req.files.forEach((file) => {
      const imageUrl = file.filename; // Assuming filename contains the image path
      imageUrls.push(imageUrl);
    });
    const userId = req.session.user.id;
    const post = new Post({
      userId,
      title,
      description,
      imageUrl: imageUrls, // Assuming the first file uploaded is the main image for the post
      likes,
      likesCount,
      comments,
    });

    // Save the post to the database
    await post.save();
    //pushing post id to profile details
    await ProfileDetails.updateOne(
      { UID: req.session.user.id },
      {
        $push: {
          posts: { postIds: post.id },
        },
      }
    );

    // Return a success response to the client
    res.status(200).json({ message: "Post created successfully", post });
  } catch (error) {
    // Handle any errors that may occur during post creation
    // For example, you can return an error response to the client
    res.status(500).json({ error: error.message });
  }
});

//home post
router.get("/homepost", async (req, res) => {
  try {
    const sessionid = req.session.user.id;
    const profile = await ProfileDetails.findOne({ UID: sessionid }).populate(
      "following.followingId"
    );
    console.log(profile);

    const followingIds = profile.following.map(
      (following) => following.followingId._id
    );
    console.log(followingIds);
    const posts = await Post.find({ userId: { $in: followingIds } });
    // console.log(posts)
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get all followers post
router.get("/followerspost/:id", async (req, res) => {
  console.log("received server");
  console.log(req.params.id);
});

// get post
router.get("/:postId", async function (req, res) {
  try {
    // const userId = req.session.userId; // Get userId from URL parameter
    const userId = new mongoose.Types.ObjectId("64346e5c0721bbc69f274e24"); //for test purpose       ///********important */
    const postId = req.params.postId; // Get postId from URL parameter

    // Find post by userId and postId in the database
    const post = await Post.findOne({ userId, _id: postId });

    if (!post) {
      // If post is not found, return an error response
      return res.status(404).json({ error: "Post not found" });
    }

    // If post is found, return a success response with the post data
    res.status(200).json({ post });
  } catch (error) {
    // Handle any errors that may occur during post retrieval
    // For example, you can return an error response to the client
    res.status(500).json({ error: error.message });
  }
});

// route for likes
router.post("/:postId/like", async (req, res) => {
  try {
    const postId = req.params.postId;
    // const userId = new mongoose.Types.ObjectId("643d0319cbbd28aaf742706e");
    const userId = req.session.user.id;

    // Find the post by ID
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Add the user ID to the likes array

    post.likes.push(userId);
    // Increment the likes count
    post.likesCount++;
    // Save the post
    await post.save();

    // Return success response
    return res.json({ message: "Post liked successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});
// route for unlikes
router.post("/:postId/unlike", async (req, res) => {
  try {
    const postId = req.params.postId;
    // const userId = new mongoose.Types.ObjectId("643d0319cbbd28aaf742706e");
    const userId = req.session.user.id;

    // Find the post by ID
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Add the user ID to the likes array
    post.likes.pull(userId);
    // Increment the likes count
    post.likesCount--;
    // Save the post
    await post.save();

    // Return success response
    return res.json({ message: "Post liked successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

//for post comments                                                                          post comment
router.post("/:postId/comments", async (req, res) => {
  console.log('object')
  console.log(req.body.comment)
  console.log(req.params.postId)
  
  

  try {
    const userId = req.session.user.id;
    const commentText  = req.body.comment;
    const postId = req.params.postId;

    // Create a new comment
    const comment = new Comment({
      userId: userId,
      postId: postId,
      commentText: commentText,
    });

    // Save the comment to the database
    await comment.save();

    // Update the post's comments array with the new comment's ID
    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    res
      .status(200)
      .json({ success: true, message: "Comment added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add comment" });
  }
});

// GET route to fetch comments for a specific post                                             get comment
router.get("/:postId/comments", async (req, res) => {
  try {
    const postId = req.params.postId;

    
    // Find the post by postId
    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Extract comment IDs from the post object
    const commentIds = post.comments;

    // Find comments by commentIds
    const comments = await Comment.find({ _id: { $in: commentIds } });

    

    const commentWithDetails = await Promise.all(
// Extract commentText from comments
comments.map(async(cmnt)=>{
const user = await ProfileDetails.findOne({UID:cmnt.userId})

return {
  
  id:cmnt.id,
  commentText:cmnt.commentText,
  likes:cmnt.likes,
  likesCount:cmnt.likesCount,
  createdAt:cmnt.createdAt,
  commentedBy: {
    nickName: user.nickName,
    profileUrl: user.profileUrl,
    userId: user.UID,
  },


}

})
      
    )

    res.status(200).json({ success: true,commentWithDetails });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve comments" });
  }
});

// Like a comment                                                                         like comment
router.post("/:postId/comments/:commentId/like", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId("64346e5c0721bbc69f274e24");
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    // Check if the comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    // Check if the user has already liked the comment
    if (comment.likes.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "User has already liked the comment",
      });
    }

    // Add the user's ID to the comment's likes array
    comment.likes.push(userId);
    // Increment the comment's likes count
    comment.likesCount += 1;
    // Save the updated comment to the database
    await comment.save();

    res
      .status(200)
      .json({ success: true, message: "Comment liked successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to like comment" });
  }
});

//get users post in profile page

router.get("/postPage/:userId", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const posts = await Post.find({ userId });
    console.log(posts);
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching posts" });
  }
});

module.exports = router;
