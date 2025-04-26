import express from "express";
import { Product } from "../models/product";

const router = express.Router();

// GET /api/products - Fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("❌ Failed to fetch products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

export default router;