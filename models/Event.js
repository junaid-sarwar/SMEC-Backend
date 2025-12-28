// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { 
    type: String, 
    required: true,
    enum: ["E-Games", "Geeks", "General Games"] 
  },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // e.g., "10:00 AM"
  location: { type: String, required: true }, // e.g., "Room HS-06"
  price: { type: Number, required: true },
  image: { type: String }, // URL from Cloudinary
  teamSize: { type: Number, default: 1, required: true }, 
  totalTickets: { type: Number, default: 100 },
  soldTickets: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);