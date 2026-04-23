import express from "express";
import { getStats } from "../controllers/adminController";
import { auth } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/adminMiddleware";

const router = express.Router();

// Admin stats route
router.get("/stats", auth, isAdmin, getStats);

export default router;