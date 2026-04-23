import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import adminRoutes from "./routes/adminRoutes";  

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Forum API is running ");
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);    

// DB Connection
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Server
app.listen(1984, () => {
  console.log("Server running on port 1984");
});