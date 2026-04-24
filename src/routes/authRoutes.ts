import express from "express";
import { register, login, logout, refreshToken } from "../controllers/authController";
import { auth } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login)
router.post("/refresh", refreshToken);
router.post("/logout", auth, logout);

export default router;