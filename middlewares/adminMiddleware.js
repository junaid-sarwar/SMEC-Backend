// middlewares/adminMiddleware.js
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: "Access Denied. Admins Only." });
        }
    } catch (error) {
        res.status(500).json({ message: "Auth Error" });
    }
};

module.exports = isAdmin;