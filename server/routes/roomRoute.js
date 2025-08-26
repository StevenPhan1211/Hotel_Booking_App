import express from "express";
import upload from "../middleware/uploadImages.js";
import { protect } from "../middleware/auth.js";
import { createRoom } from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.post("/", upload.array("images", 4), protect, createRoom)


export default roomRouter;
