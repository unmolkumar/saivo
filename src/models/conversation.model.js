const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  chat_id: {
    type: String,
    required: true,
    uniqure: true,
  },
  conversation: [
    {
      role: String,
      content: String,
    },
  ],
});
const conversationModel = mongoose.model("conversations", conversationSchema);

module.exports = conversationModel;
