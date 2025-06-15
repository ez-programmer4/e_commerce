const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { authMiddleware } = require("../middleware/auth");
const catchAsync = require('./../utilities/catchAsync');
const AppError = require('./../utilities/AppError')
const cartController = require('./../controller/cartController')

// Get user's cart
router.get("/", authMiddleware, cartController.getUserCart);

// Add item to cart
router.post("/", authMiddleware, cartController.addItemToCart);

module.exports = router;