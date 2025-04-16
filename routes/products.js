const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    // Ensure 'error' is defined
    res.status(500).json({ error: error.message });
  }
});

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    // Ensure 'error' is defined
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
