import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./configs/db.js"
import { clerkMiddleware } from "@clerk/express";
import clerkHooks from "./controllers/clerkHooks.js";
import userRouter from "./routes/userRoute.js";

connectDB()

const app = express()
app.use(cors()) // Enabe Cross-Origin Resource Sharing (CORS)

// Middleware from Clerk
app.use(express.json())
app.use(clerkMiddleware())

// API to listen to Clerk Webhooks
app.use("/api/clerk", clerkHooks) 

app.get("/", (req, res) => res.send("API is working"))

// Routes for many paths
app.use("/api/user", userRouter)



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));