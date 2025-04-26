import express from "express";
import { z } from "zod";
import { insertOrderSchema } from "@shared/schema";
import { storage } from "../storage";
import { isAdmin } from "../middleware/auth";

const router = express.Router();

// Get orders for the authenticated user
router.get("/", async (req, res, next) => {
  try {
    const userId = (req.user as any).id;
    const orders = await storage.getOrders(userId);
    
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

// Get all orders (admin only)
router.get("/admin", isAdmin, async (req, res, next) => {
  try {
    const orders = await storage.getAllOrders();
    
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

// Get a specific order
router.get("/:id", async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await storage.getOrder(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Check if user is authorized to view this order
    if ((req.user as any).role !== "admin" && (req.user as any).id !== order.userId) {
      return res.status(403).json({ message: "Unauthorized to view this order" });
    }
    
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

// Create a new order
router.post("/", async (req, res, next) => {
  try {
    const userId = (req.user as any).id;
    
    // Basic validation - items array must not be empty
    if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" });
    }
    
    // Calculate total price for order
    const items = req.body.items;
    const total = items.reduce((sum: number, item: any) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    // Mock shipping address for demo purposes
    // In a real app, you would get this from the user's saved addresses
    const userAddresses = await storage.getUserAddresses(userId);
    let shippingAddressId;
    
    if (userAddresses.length > 0) {
      // Use the default address if available
      const defaultAddress = userAddresses.find(addr => addr.isDefault);
      shippingAddressId = defaultAddress ? defaultAddress.id : userAddresses[0].id;
    } else {
      // Create a dummy address if none exists
      const newAddress = await storage.createAddress({
        userId,
        fullName: (req.user as any).name,
        addressLine1: "123 Main Street",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
        country: "India",
        phone: "9876543210",
        isDefault: true
      });
      shippingAddressId = newAddress.id;
    }
    
    // Create order
    const orderData = {
      userId,
      items: JSON.stringify(items),
      total,
      status: "pending",
      shippingAddressId,
      paymentMethod: "Credit Card"
    };
    
    const newOrder = await storage.createOrder(orderData);
    
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

// Update order status (admin only)
router.patch("/:id", isAdmin, async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    
    // Validate status
    if (!status || !["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }
    
    // Update order
    const updatedOrder = await storage.updateOrderStatus(orderId, status);
    
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
});

export const orderRoutes = router;
