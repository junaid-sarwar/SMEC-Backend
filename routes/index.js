// routes/index.js
const express = require('express');
const router = express.Router()

const userRoutes = require('./userRoutes');

const eventRoutes = require('./eventRoutes')

router.use("/api/user", userRoutes);
router.use("/api/events", eventRoutes);

module.exports = router