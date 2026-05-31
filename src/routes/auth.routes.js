const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authMiddleware.validateUser, authController.logoutUser);

module.exports = router;
