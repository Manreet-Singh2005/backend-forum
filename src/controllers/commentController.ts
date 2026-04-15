import { Request, Response } from "express";
import Comment from "../models/Comment";

// Add Comment
export const createComment = async (req: any, res: Response) => {
  try {
    const { text, postId } = req.body;

    if (!text || !postId) {
      return res.status(400).json({ message: "Text and postId required" });
    }

    const comment = new Comment({
      text,
      postId,
      userId: req.user.userId
    });

    await comment.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Comments for a Post
export const getComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Comment (ONLY OWNER)
export const updateComment = async (req: any, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (!comment.userId || comment.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    comment.text = req.body.text || comment.text;

    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Comment (OWNER OR ADMIN)
export const deleteComment = async (req: any, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (
      !comment.userId ||
      (comment.userId.toString() !== req.user.userId &&
        req.user.role !== "admin")
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await comment.deleteOne();

    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};