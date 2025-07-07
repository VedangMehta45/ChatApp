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
  console.log("New client", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    users[userId] = socket.id;
    console.log("Connected Users: ", users);
  }
  io.emit("getOnline", Object.keys(users)); //Will show whether the user is online or offline
  // Handle incoming messages
  // socket.on("sendMessage", (messageData) => {
  //   const { receiverId, message } = messageData;

  //   // Get receiver's socket ID
  //   const receiverSocketId = users[receiverId];

  //   if (receiverSocketId) {
  //     // Emit the message to the receiver
  //     io.to(receiverSocketId).emit("newMessage", message);
  //   } else {
  //     console.log("User not connected or online");
  //   }
  // });
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
    delete users[userId];
    io.emit("getOnline", Object.keys(users));
  });
});

export { app, io, server };
