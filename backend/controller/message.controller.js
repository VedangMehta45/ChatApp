import { io } from "../SocketIO/server.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getRecieverSocketId } from "../SocketIO/server.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Check if the message is not empty
    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    //added
    if (message.length > 500) {
      return res.status(400).json({ message: "Message is too long" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      // Create a new conversation if none exists
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create a new message
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    // Save both the message and the updated conversation
    await newMessage.save();
    conversation.messages.push(newMessage._id);
    await conversation.save();

    //now we will send the message to the socket server directly
    const receiversocketId = getRecieverSocketId(receiverId);
    if (receiversocketId) {
      io.to(receiversocketId).emit("newMessage", newMessage);
    }

    // Return a success response
    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (err) {
    console.log("Error in sending message " + err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: chatuser } = req.params;
    const senderId = req.user._id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, chatuser] },
    }).populate("messages"); //to see actual content or actual message
    if (!conversation) {
      return res.status(201).json({ messages: [] });
    }
    const messages = conversation.messages;
    res.status(201).json({ messages });
  } catch (err) {
    console.log("Message getting error " + err);
    res.status(500).json({ err: "Internal server error" });
  }
};
