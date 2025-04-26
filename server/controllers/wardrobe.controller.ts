import express from "express";
import { storage } from "../storage";

const router = express.Router();

// Get wardrobe items for authenticated user
router.get("/", async (req, res, next) => {
  try {
    const userId = (req.user as any).id;
    const wardrobeItems = await storage.getWardrobeItems(userId);
    
    res.status(200).json(wardrobeItems);
  } catch (error) {
    next(error);
  }
});

// Add item to wardrobe (typically done after purchase/order)
router.post("/", async (req, res, next) => {
  try {
    const userId = (req.user as any).id;
    const { productId } = req.body;
    
    // Validate productId
    if (!productId || isNaN(Number(productId))) {
      return res.status(400).json({ message: "Valid productId is required" });
    }
    
    // Check if product exists
    const product = await storage.getProduct(Number(productId));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Add to wardrobe
    const wardrobeItem = await storage.addToWardrobe({
      userId,
      productId: Number(productId)
    });
    
    res.status(201).json(wardrobeItem);
  } catch (error) {
    next(error);
  }
});

export const wardrobeRoutes = router;
