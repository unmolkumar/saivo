const express = require("express");
const chatController = require("../controllers/chat.controller.js");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware.js");

router.post("/new-chat", authMiddleware.validateUser, chatController.newChat);

router.post("/:chat_id", chatController.continueChat);

module.exports = router;
