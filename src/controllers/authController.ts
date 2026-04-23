import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword
  });

  await user.save();

  res.status(201).json({ message: "User registered" });
};

// Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.password) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password as string);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const payload = { userId: user._id, role: user.role};

  //Access Token
  const accessToken = jwt.sign( payload, "access_secret", {
    expiresIn: "15m"
  });

  const refreshToken = jwt.sign( payload, "refresh_secret", {
    expiresIn: "7d"
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict"
  });

  res.json({accessToken});
};

export const refreshToken = (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded: any = jwt.verify(token, "refresh_secret");

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role },
      "access_secret",
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });

  } catch {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};
export const logout =(req: any, res: any) =>{
  res.clearCookie("refreshToken");
  //No real server-side logout in JWT
  res.json({ message:"Logout successful"});
}