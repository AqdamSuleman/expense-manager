const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/items
// @desc    Add new item
// @access  Protected
router.post('/items', protect, async (req, res) => {
  const { itemName, description, type, location, date, contactInfo } = req.body;

  try {
    const item = await Item.create({
      user: req.user._id,
      itemName,
      description,
      type,
      location,
      date,
      contactInfo
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/items
// @desc    Get all items
// @access  Protected
router.get('/items', protect, async (req, res) => {
  try {
    const items = await Item.find().sort({ date: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/items/search
// @desc    Search items by name
// @access  Protected
router.get('/items/search', protect, async (req, res) => {
  const { name } = req.query;
  try {
    const items = await Item.find({
      itemName: { $regex: name, $options: 'i' }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/items/:id
// @desc    Get item by ID
// @access  Protected
router.get('/items/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/items/:id
// @desc    Update item
// @access  Protected
router.put('/items/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Only owner can update
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete item
// @access  Protected
router.delete('/items/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Only owner can delete
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;