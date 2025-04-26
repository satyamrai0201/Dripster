import { Router } from 'express';
import Drip from '../models/Drip';

const router = Router();

// GET /api/drips - Get all products
router.get('/', async (req, res) => {
  try {
    const items = await Drip.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// POST /api/drips - Create a new product
router.post('/', async (req, res) => {
  try {
    const newItem = new Drip(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create product', error: err });
  }
});

// PUT /api/drips/:id - Update product
router.put('/:id', async (req, res) => {
  try {
    const updated = await Drip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update product' });
  }
});

// DELETE /api/drips/:id - Delete product
router.delete('/:id', async (req, res) => {
  try {
    await Drip.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete product' });
  }
});

export default router;