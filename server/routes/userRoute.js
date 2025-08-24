import express from "express";
import { protect } from "../middleware/auth.js";
import { getUserData, storeRecentSearchedCities } from "../controllers/userController.js";

// Router define
const userRouter = express.Router();

userRouter.get("/", protect, getUserData) // "protect" part from auth.js
userRouter.post("/store-recent-search", protect, storeRecentSearchedCities)



export default userRouter;
