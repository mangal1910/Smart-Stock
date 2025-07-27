const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    brand: String,
    quantity: Number,
    price: Number,
    mfgDate: Date,
    expiryDate: Date,
});

module.exports = mongoose.model('Item', ItemSchema);
