import { Request, Response } from "express";
import Post from "../models/Post";

//  Create Post
export const createPost = async (req: any, res: Response) => {
  try {
    const { title, content } = req.body;

    const post = new Post({
      title,
      content,
      userId: req.user.userId
    });

    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//  Get All Posts
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//  Update Post (ONLY OWNER)
export const updatePost = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (
      !post.userId ||
      post.userId.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//  Delete Post (OWNER OR ADMIN)
export const deletePost = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (
      !post.userId ||
      (post.userId.toString() !== req.user.userId &&
        req.user.role !== "admin")
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};