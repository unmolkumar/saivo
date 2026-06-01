const conversationModel = require("../models/conversation.model");
const chatModel = require("../models/chat.model.js");
const userModel = require("../models/user.model.js");
const aiService = require("../services/ai.service.js");
async function newChat(req, res) {
  const { username } = req.user;
  const user = await userModel.findOne({
    username: username,
  }); //authMiddleware
  const prompt = req.body.prompt;
  const userQuery = {
    role: "user",
    content: prompt,
  };
  const userMessage = [userQuery];
  const response = await aiService.answer(userMessage);
  const conversationTitle = await aiService.title(prompt);
  const chat = await chatModel.create({
    userId: user._id,
    chat_id: response.id,
    creation_time: response.created,
    chat_title: conversationTitle.choices[0].message.content,
  });
  const assistantResponse = {
    role: response.choices[0].message.role,
    content: response.choices[0].message.content,
  };
  const conversation = await conversationModel.create({
    chat_id: chat.chat_id,
    conversation: [userQuery, assistantResponse],
  });
  res.status(201).json({
    message: "chat created successfully",
    prompt: prompt,
    "assistant response": assistantResponse.content,
  });
}

module.exports = { newChat };
