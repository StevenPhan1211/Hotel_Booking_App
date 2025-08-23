import User from "../models/User.js";

// Middleware to check if User is authenticated
export const protect = async (req, res, next) => {
    const {userId} = req.auth;
    if (!userId) {
        res.json({
            success: false, 
            message: "User is not authenticated!"
        });
    } else {
        const user = await User.findById(userId);
        req.user = user;
        next()
    }
}