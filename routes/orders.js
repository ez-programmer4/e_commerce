const express = require("express");
const router = express.Router();
const orderController = require('./../controller/orderController')
const { authMiddleware } = require("../middleware/auth");


// Create order from cart
router.post("/", authMiddleware, orderController.orderProduct);

// Get user's orders
router.get("/", authMiddleware, orderController.getOrder);

module.exports = router;
