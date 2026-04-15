import express from "express";
import {
  createComment,
  getComments,
  updateComment,
  deleteComment
} from "../controllers/commentController";

import { auth } from "../middleware/authMiddleware";

const router = express.Router();

// Create comment
router.post("/", auth, createComment);

// Get comments by post
router.get("/:postId", auth, getComments); // ✅ protected

// Update comment
router.put("/:id", auth, updateComment);

// Delete comment
router.delete("/:id", auth, deleteComment);

export default router;