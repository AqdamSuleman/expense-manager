const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/expense
// @desc    Add new expense
// @access  Protected
router.post('/expense', protect, async (req, res) => {
  const { title, amount, category, date } = req.body;

  try {
    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date
    });

    res.status(201).json(expense);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/expenses
// @desc    Get all expenses of logged in user
// @access  Protected
router.get('/expenses', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
    res.json(expenses);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;