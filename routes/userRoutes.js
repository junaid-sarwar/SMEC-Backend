// routes/userRoutes.js
const express = require('express')
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

const {
    createUser,
    loginUser,
    loginAdmin,
    logout,
    updateProfile,
} = require('../controllers/userController');

// ========== LOGIN SIGNUP THING =================
router.post("/sign-up", createUser);
router.post("/login", loginUser);
router.get('/logout',logout)

// ============== UPDATE PROFILE =================

router.put('/update-profile', protect, updateProfile);
router.patch('/update-profile', protect, updateProfile);

// ============ ADMIN LOGIN =================
router.post("/admin-login", loginAdmin);

module.exports = router