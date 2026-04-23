import express from "express";
import { getStats } from "../controllers/adminController";
import { auth } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/adminMiddleware";
import { deleteUser } from "../controllers/adminController";

const router = express.Router();

// Admin stats route
router.get("/stats", auth, isAdmin, getStats);
//Delete User(admin only)
router.delete("/user/:id", auth, isAdmin, deleteUser);

export default router;