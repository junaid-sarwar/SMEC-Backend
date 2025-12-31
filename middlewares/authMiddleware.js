// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

dotenv.config();

const protect = async(req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.userId = decoded.userId;
        // console.log("decoded",decoded)
        next();
    } catch (error) {
        console.log("error: ",error);
        return res.status(401).json({
            message: "Invalid or expired Token",
        })
    }
    // console.log("token", token)
};

module.exports = {
    protect,
}