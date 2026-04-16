import { Request, Response } from "express";
import Post from "../models/Post";

// Like / Unlike (Toggle)
export const toggleLike = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.userId;

    const likesArray = (post.likes || []) as any[];

    //Check if already like
    const alreadyLiked = likesArray.some(
      (id: any) => id.toString() === userId
    );

 
    if (alreadyLiked) {
      //Unlike
      post.likes = likesArray.filter(
        (id: any) => id.toString() !== userId
      );
    } else {
      //Like
      likesArray.push(userId);
      post.likes = likesArray;
    }

    await post.save();

    res.json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      totalLikes: likesArray.length
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};