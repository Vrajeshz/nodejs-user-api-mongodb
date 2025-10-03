const express = require("express");
const route = express.Router();

// const User = require("./../modles/user");

// const userController = require('./../controller/userControllers');
const userController = require("../Controller/userController");
// const reviewController = require('./../controller/reviewController');

route.post("/signup", userController.signup);
route.post("/login", userController.login);
route.get(
  "/allUser",
  userController.protect,
  userController.restrictTo("admin"),
  userController.getAllUser
);
route.get("/getMe", userController.protect, userController.getMe);
route.get("/:id", userController.protect, userController.getUserById);

module.exports = route;
