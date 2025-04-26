// /server/models/product.ts
import mongoose from "mongoose";
import { type InsertProduct } from "@shared/schema"; // adjust if needed

const productSchema = new mongoose.Schema<InsertProduct>({
  name: String,
  description: String,
  images: [String],
  price: Number,
  originalPrice: Number,
  gender: String,
  category: String,
  sizes: [String],
  rating: Number,
  reviewCount: Number,
  stock: Number,
  tags: [String],
  deliveryEta: String,
  isNew: Boolean,
  discount: Number,
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);