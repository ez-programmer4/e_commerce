const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { authMiddleware, adminMiddleware , sellerMiddleware } = require("../middleware/auth");
const catchAsync = require('./../utilities/catchAsync')

router.get("/", catchAsync(async (req, res) => {
  
    const products = await Product.find();
    res.json(products);
  
}));
router.post('/' ,authMiddleware , sellerMiddleware , catchAsync(async (req , res) => {
    const product = new Product({
        ...req.body,
        owner : req.user._id
    })
    await product.save();
    res.status(201).json({ message: "Product submitted for review", product });
}))

router.post("/", authMiddleware, adminMiddleware, catchAsync(async (req, res) => {
  
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  
}));

module.exports = router;
