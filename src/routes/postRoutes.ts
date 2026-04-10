import express from "express";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost
} from "../controllers/postController";

import { auth } from "../middleware/authMiddleware";

const router = express.Router();

// Protected routes
router.post("/", auth, createPost);
router.get("/", auth, getPosts); 
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);

export default router;