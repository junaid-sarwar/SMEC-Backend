// models/Discount.js
const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // e.g., "SMEC2026"
  percentage: { type: Number, required: true }, // e.g., 20 for 20%
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Discount', discountSchema);