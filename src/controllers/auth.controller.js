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

async function loginUser(req, res) {
  //check if user exist or not
  const { username, email, password } = req.body;
  const user = await userModel.findOne({
    $or: [{ username: username }, { email: email }],
  });
  if (!user) {
    return res.status(401).json({
      message: "user does not exist",
    });
  }
  const userToken = req.cookies.token;
  if (!userToken) {
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "invalid credentials",
      });
    }
    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );
    res.cookie("token", token);
    res.status(200).json({
      message: "login successfull",
    });
  }
  try {
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
    res.status(200).json({
      message: "login successfull",
    });
  } catch (err) {
    return res.status(401).json({
      message: "invalid token",
    });
  }
}

function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "logout successfull",
  });
}
module.exports = { registerUser, loginUser, logoutUser };
