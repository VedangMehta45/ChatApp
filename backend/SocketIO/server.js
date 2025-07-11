import { Server } from "socket.io";
import http from "http";
import express from "express";
import { Socket } from "dgram";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4001",
    methods: ["GET", "POST"],
  },
});

//real time message function:
export const getRecieverSocketId = (recieverId) => {
  return users[recieverId];
};

const users = {};
//Socket is used on both size frontend and backend
io.on("connection", (socket) => {
  console.log("✅ [Backend] New socket connected:", socket.id);
  console.log("New client", socket.id);
  const userId = socket.handshake.query.userId;
  console.log("🆔 [Backend] Connected User ID:", userId);
  if (userId) {
    users[userId] = socket.id;
    // console.log("Connected Users: ", users);
    console.log("📌 [Backend] Users Map:", users);
  }
  io.emit("onlineUsers", Object.keys(users)); //Will show whether the user is online or offline



  // Handle incoming messages
  socket.on("sendMessage", (messageData) => {

    const { receiverId, message } = messageData;
    const receiverSocketId = users[receiverId];
      console.log("📤 Sending message to receiverId:", receiverId);
      console.log("📨 Message content:", message);
      console.log("🎯 Receiver socket ID:", receiverSocketId);
    if (receiverSocketId) {
      // Emit the message to the receiver
      console.log("📤 [Backend] Emitting newMessage to receiver");
      io.to(receiverSocketId).emit("newMessage", message);
      console.log("✅ Message emitted to receiver");
      console.log("📤 Emitting to:", receiverSocketId);
console.log("📤 Payload:", message);

    } else {
      console.log("User not connected or online");
      console.log("❌ [Backend] Receiver not connected");

    }
  });


  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id, "for userId:", userId);
    delete users[userId];
    io.emit("onlineUsers", Object.keys(users));
  });
});

export { app, io, server };
