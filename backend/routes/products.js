const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// @desc    Get all products
// @route   GET /api/products
// @desc    Get all products with filters
// @route   GET /api/products
router.get("/", async (req, res) => {
  const { category, rating, title_search, sort_by } = req.query;

  const query = {};

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Filter by rating (e.g., rating=4 means rating >= 4)
  if (rating) {
    query.rating = { $gte: parseFloat(rating) };
  }

  // Filter by title (case-insensitive partial match)
  if (title_search) {
    query.title = { $regex: title_search, $options: "i" };
  }

  // Sorting logic
  let sortQuery = {};
  if (sort_by === "PRICE_HIGH") {
    sortQuery.price = -1; // Descending
  } else if (sort_by === "PRICE_LOW") {
    sortQuery.price = 1; // Ascending
  }

  try {
    const products = await Product.find(query).sort(sortQuery);
    res.json({ products });
  } catch (err) {
    console.error("❌ DB Error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// @desc    Insert all products (run once)
// @route   POST /api/products
router.post("/insert", async (req, res) => {
  try {
    const productsArray = req.body.products;
    await Product.insertMany(productsArray);
    res.status(201).json({ message: "Products inserted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to insert products" });
  }
});
// @desc Get specific product by ID with similar products
// @route GET /api/products/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ id: parseInt(id) });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Find 3 similar products by same category (excluding current one)
    const similar_products = await Product.find({
      category: product.category,
      id: { $ne: product.id },
    })
      .limit(3)
      .select("-_id -__v");

    res.json({ product, similar_products });
  } catch (err) {
    console.error("❌ Error fetching product by ID:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
