var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Conversation = require("../src/Database/SchemaModel/conversationSchema");

//creating a new conversation b/w 2 users
router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (e) {
    console.log(e);
  }
});
//all conversations of a user
router.get("/allConversation/:userId", async (req, res) => {
  var senderId = req.params.userId;
  try {
    const conversation = await Conversation.find({
      members: { $in: [senderId] },
    });

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//find a single conversation b/w 2 users
router.get("/findConversation/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
