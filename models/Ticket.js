// models/Ticket.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  // New Fields
  serialNumber: { type: String, required: true, unique: true }, // e.g., "SMEC-7482"
  teamMembers: [
    {
      fullName: { type: String , required: true },
      universityName: { type: String, required: true }
    }
  ],
  pricePaid: { type: Number, required: true },
  discountCode: { type: String, default: null },
  purchaseDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);