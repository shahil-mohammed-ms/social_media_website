var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

const ProfileDetails = require("../src/Database/SchemaModel/profileDetailsSchema");

//for following
router.post("/:otherUserId", async (req, res) => {
  try {
    const OtherUserId = req.params.otherUserId;

    const userId = req.session.user.id;

    const followersDb = await ProfileDetails.updateOne(
      { UID: OtherUserId },
      {
        $push: { followers: { followersId: userId } },
        $inc: { followersCount: 1 },
      }
    );
    const followingDb = await ProfileDetails.updateOne(
      { UID: userId },
      {
        $push: { following: { followingId: OtherUserId } },
        $inc: { followingCount: 1 },
      }
    );

    res.json("follower added" + followersDb + "following" + followingDb);
  } catch (e) {
    console.log(e);
  }
});

//for unfollowing
router.post("/:otherUserId/unfollow", async (req, res) => {
  try {
    const OtherUserId = req.params.otherUserId;
    const userId = req.session.user.id;

    const followersDb = await ProfileDetails.updateOne(
      { UID: OtherUserId },
      {
        $pull: { followers: { followersId: userId } },
        $inc: { followersCount: -1 },
      }
    );

    const followingDb = await ProfileDetails.updateOne(
      { UID: userId },
      {
        $pull: { following: { followingId: OtherUserId } },
        $inc: { followingCount: -1 },
      }
    );

    res.json(
      "Follower removed: " + followersDb + " Following removed: " + followingDb
    );
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
