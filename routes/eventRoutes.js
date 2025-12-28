// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/adminMiddleware');
const { upload } = require('../config/cloudinary'); // Multer config
const { createCategory, createEvent, getAllEvents, deleteEvent } = require('../controllers/eventController');
const { buyTicket, createDiscount,getAllDiscounts, toggleDiscountStatus } = require('../controllers/ticketController');

// Public
router.get('/all', getAllEvents);

// Buyer
router.post('/buy-ticket', protect, buyTicket);

// Admin Routes
router.post('/category', protect, isAdmin, createCategory);
router.post('/create', protect, isAdmin, upload.single('image'), createEvent); // Image upload here

router.post('/discount', protect, isAdmin, createDiscount);
router.get('/discounts', protect, isAdmin, getAllDiscounts); // [NEW] Get All
router.patch('/discount/:id', protect, isAdmin, toggleDiscountStatus); // [NEW] Toggle

router.delete('/:id', protect, isAdmin, deleteEvent);

module.exports = router;