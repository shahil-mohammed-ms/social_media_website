var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Message = require("../src/Database/SchemaModel/MessageSchema");

router.post("/", async (req, res) => {
  console.log(req.body);
  const message = new Message(req.body);

  try {
    const savedMessage = await message.save();
    res.status(200).json(savedMessage);
  } catch (e) {
    console.log(e);
  }
});

router.get("/:conversationId", async (req, res) => {
  try {
    const getChats = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(getChats);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
