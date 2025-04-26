import mongoose from "mongoose";
import dotenv from "dotenv";
import { getProductsData } from "./data/products"; // ✅ named import
import { Product } from "./models/product"; // ✅ assuming this is your Mongoose model

dotenv.config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("✅ Connected to MongoDB");

    // Optional: clear existing products
    await Product.deleteMany({});
    console.log("🧹 Cleared existing products");

    // Insert new products
    const products = getProductsData(); // ✅ fetch data
    await Product.insertMany(products); // ✅ insert into DB
    console.log("🌱 Products seeded successfully");

    process.exit(0); // exit cleanly
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedDatabase();