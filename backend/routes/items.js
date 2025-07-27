const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// Helper: Expiry Status
function getExpiryStatus(expiryDate) {
    const now = new Date();
    const expDate = new Date(expiryDate);
    const diff = (expDate - now) / (1000 * 60 * 60 * 24); // days
    if (diff < 0) return 'red';
    if (diff <= 30) return 'yellow';
    return 'green';
}

// Get all items for logged-in user
router.get('/', auth, async (req, res) => {
    try {
        let items = await Item.find({ userId: req.user.id }).sort({ expiryDate: 1 });
        items = items.map(item => ({
            ...item.toObject(),
            expiryStatus: getExpiryStatus(item.expiryDate)
        }));
        res.json(items);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Add item
router.post('/', auth, async (req, res) => {
    try {
        const item = new Item({ ...req.body, userId: req.user.id });
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Edit/Update item
router.put('/:id', auth, async (req, res) => {
    try {
        const item = await Item.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Delete item
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await Item.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
