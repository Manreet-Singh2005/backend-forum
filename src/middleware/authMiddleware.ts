import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded;
    next();
  } catch {
    res.status(400).json({ message: "Invalid token" });
  }
};