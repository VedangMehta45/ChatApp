import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";


import userRouter from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import conversationRouter from "./routes/conversation.route.js"; // <-- import conversation routes

import { app, server } from "./SocketIO/server.js";

dotenv.config();
const __dirname = path.resolve();

app.use(express.json());
app.use(cors()); // Enable CORS for all requests
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

const PORT = process.env.PORT || 5001;
const URI = process.env.MONGODB_URI;

// Connecting to DB
try {
  mongoose.connect(URI).then(() => console.log("Mongodb Connected"));
} catch (error) {
  console.log(error);
}

// Routes
app.use("/api/user", userRouter);
app.use("/api/message", messageRoute);
app.use("/api/conversations", conversationRouter); // <-- add conversation routes here

server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
