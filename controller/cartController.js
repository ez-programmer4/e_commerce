const express = require('express')
const Cart = require('./../models/Cart')
const catchAsync = require('./../utilities/catchAsync')
const AppError = require('./../utilities/AppError')
const Product = require('./../models/Product')

exports.getUserCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ userId: req.user.userId }).populate(
    "items.productId"
  );
  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }
  res.status(200).json(cart);  // More consistent to return cart directly
})
exports.addItemToCart =  catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;

  // Validate product
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError('Product not found', 404));
  }
  if (product.stock < quantity) {
    return next(new AppError('Insufficient stock', 400));  // 400 might be better than 404
  }

  // Find or create cart
  let cart = await Cart.findOne({ userId: req.user.userId });
  if (!cart) {
    cart = new Cart({ userId: req.user.userId, items: [] });
  }

  // Update cart
  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }
  cart.updatedAt = Date.now();
  await cart.save();

  res.status(201).json(cart);
});