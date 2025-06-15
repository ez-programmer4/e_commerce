const express = require('express')
const Product = require('./../models/Product')
const catchAsync = require('./../utilities/catchAsync')
const AppError = require('./../utilities/AppError')

exports.getAllProduct = catchAsync(async (req, res) => {
  
    const products = await Product.find();
    res.json(products);
  
})
exports.sellerPostProduct = catchAsync(async (req , res) => {
    const product = new Product({
        ...req.body,
        owner : req.user._id
    })
    await product.save();
    res.status(201).json({ message: "Product submitted for review", product });
})