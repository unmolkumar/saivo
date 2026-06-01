const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  chat_id: {
    type: String,
    required: true,
    unique: true,
  },
  creation_time: {
    type: Number,
    required: true,
  },

  chat_title: {
    type: String,
  },
});

const chatModel = mongoose.model("chats", chatSchema);

module.exports = chatModel;
