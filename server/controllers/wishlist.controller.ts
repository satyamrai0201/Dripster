import express from "express";
import { z } from "zod";
import { storage } from "../storage";

const router = express.Router();

// Get wishlist items for authenticated user
router.get("/", async (req, res, next) => {
  try {
    const userId = (req.user as any).id;
    const wishlistItems = await storage.getWishlistItems(userId);
    
    res.status(200).json(wishlistItems);
  } catch (error) {
    next(error);
  }
});

// Add item to wishlist
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
    
    // Add to wishlist
    const wishlistItem = await storage.addToWishlist({
      userId,
      productId: Number(productId)
    });
    
    res.status(201).json(wishlistItem);
  } catch (error) {
    next(error);
  }
});

// Check if product is in wishlist
router.get("/check/:productId", async (req, res, next) => {
  try {
    const userId = (req.user as any).id;
    const productId = parseInt(req.params.productId);
    
    const isInWishlist = await storage.isInWishlist(userId, productId);
    
    res.status(200).json({ isInWishlist });
  } catch (error) {
    next(error);
  }
});

// Remove item from wishlist
router.delete("/:productId", async (req, res, next) => {
  try {
    const userId = (req.user as any).id;
    const productId = parseInt(req.params.productId);
    
    // Remove from wishlist
    const removed = await storage.removeFromWishlist(userId, productId);
    
    if (!removed) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }
    
    res.status(200).json({ message: "Item removed from wishlist" });
  } catch (error) {
    next(error);
  }
});

export const wishlistRoutes = router;
