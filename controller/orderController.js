const express = require('express')
const Order = require('./../models/Order')
const Cart =require('./../models/Cart')
const catchAsync = require('./../utilities/catchAsync')
const Product = require('./../models/Product')
const AppError = require('./../utilities/AppError')

exports.orderProduct =catchAsync(async (req, res , next) => {
 
    const cart = await Cart.findOne({ userId: req.user.userId }).populate(
      "items.productId"
    );
    if (!cart || cart.items.length === 0) {
      return next(new AppError('cart is Empty' , 400))
    }

    // Validate stock
    for (const item of cart.items) {
      if (item.productId.stock < item.quantity) {
        return next(new AppError(`Insufficient stock for ${item.productId.name}` , 400))
      }
    }

    // Calculate total and create order
    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price * (1 - item.productId.discount / 100),
    }));
    const total = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new Order({
      userId: req.user.userId,
      items: orderItems,
      total,
    });
    await order.save();

    // Update stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart
    await Cart.findOneAndUpdate(
      { userId: req.user.userId },
      { items: [], updatedAt: Date.now() }
    );

    res.status(201).json(order);
  
});
exports.getOrder = catchAsync(async (req, res) => {
 
    const orders = await Order.find({ userId: req.user.userId }).populate(
      "items.productId"
    );
    res.json(orders);
 
})