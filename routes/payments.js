const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const { authMiddleware } = require("../middleware/auth");

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order || order.userId.toString() !== req.user.userId) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order.status !== "pending") {
      return res.status(400).json({ error: "Order already processed" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Cents
      currency: "usd",
      metadata: { orderId: orderId.toString() },
    });

    // Update order status
    order.status = "processing";
    await order.save();

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
