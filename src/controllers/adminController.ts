import { Request, Response } from "express";
import User from "../models/User";
import Post from "../models/Post";
import Comment from "../models/Comment";

export const getStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();

    const posts = await Post.find().select("likes");

    const totalLikes = posts.reduce(
      (sum, post) => sum + ((post.likes as any[])?.length || 0),
      0
    );

    res.json({
      totalUsers,
      totalPosts,
      totalComments,
      totalLikes
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const deleteUser = async (req: any, res: any) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};