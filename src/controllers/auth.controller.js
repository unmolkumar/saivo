const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function registerUser(req, res) {
  //first check if user exist
  const { username, email, password } = req.body;
  const isUserExist = await userModel.findOne({
    $or: [{ username: username }, { email: email }],
  });
  if (isUserExist) {
    return res.status(409).json({
      message: "user with this username/email already registered",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    username: username,
    email: email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      username: username,
      email: email,
    },
    process.env.JWT_SECRET,
  );
  res.cookie("token", token);
  res.status(201).json({
    message: "user created successfully",
  });
}

module.exports = { registerUser };
