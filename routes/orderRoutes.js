const express = require("express");
const Order = require("../models/orderModel");

const router = express.Router();

// ✅ Place a new order
router.post("/", async (req, res) => {
  try {
    const { userId, products, totalPrice } = req.body;

    const order = new Order({ userId, products, totalPrice });
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get all orders (Admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("userId").populate("products.productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get user orders by userId
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate("products.productId");
    if (!orders.length) return res.status(404).json({ message: "No orders found for this user" });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Update order status (Admin)
router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Delete an order
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
