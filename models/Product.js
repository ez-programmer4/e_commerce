const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    maxlength: [100, "Name cannot exceed 100 characters"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, "Discount cannot be negative"],
    max: [100, "Discount cannot exceed 100%"],
  },
  stock: {
    type: Number,
    required: [true, "Stock quantity is required"],
    min: [0, "Stock cannot be negative"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["Casual Wear", "Formal Wear", "Islamic Traditional", "Accessories"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    maxlength: [1000, "Description cannot exceed 1000 characters"],
  },
  image: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
