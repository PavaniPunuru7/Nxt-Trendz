const mongoose = require("mongoose");

const similarProductSchema = new mongoose.Schema({
  id: Number,
  title: String,
  brand: String,
  price: Number,
  imageUrl: String,
  rating: Number,
  description: String,
  availability: String,
  totalReviews: Number,
});

const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  brand: String,
  price: Number,
  imageUrl: String,
  rating: String, // Keep as string if stored like "3.2"
  description: String,
  availability: String,
  totalReviews: Number,
  category: String, // ✅ Include category for filtering
  similar_products: [similarProductSchema],
});

module.exports = mongoose.model("Product", productSchema);
