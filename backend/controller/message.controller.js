import { io } from "../SocketIO/server.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getRecieverSocketId } from "../SocketIO/server.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const file = req.file;

    // ✅ Log incoming request details
    console.log("📥 [BACKEND] Incoming sendMessage request");
    console.log("✅ req.body:", req.body);
    console.log("📎 req.file:", req.file);
    console.log("🆔 senderId:", senderId, "➡️ receiverId:", receiverId);

    // ✅ Validate input: either message or file must be provided
    if (!message && !file) {
      console.log("❌ No message or file provided");
      return res.status(400).json({ message: "Message or file is required" });
    }

    // ✅ Check for long messages
    if (message && message.length > 500) {
      console.log("❌ Message too long");
      return res.status(400).json({ message: "Message is too long" });
    }

    // ✅ Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      console.log("ℹ️ No conversation found. Creating new one...");
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // ✅ Create message
    const newMessage = new Message({
      senderId,
      receiverId,
      message: message || "",
      file: file ? file.filename : null,
    });

    console.log("🧾 Message to save:", {
      senderId,
      receiverId,
      message,
      file: file ? file.filename : null,
    });

    await newMessage.save();
    console.log("💾 Saved newMessage:", newMessage);

    // ✅ Push message to conversation
    conversation.messages.push(newMessage._id);
    await conversation.save();

    // ✅ Emit message via socket
    const receiversocketId = getRecieverSocketId(receiverId);
    if (receiversocketId) {
      console.log("📤 Emitting message to socket:", receiversocketId);
      io.to(receiversocketId).emit("newMessage", newMessage);
    } else {
      console.log("⚠️ Receiver socket ID not found or user offline");
    }

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (err) {
    console.error("❌ Error in sending message:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET messages
export const getMessage = async (req, res) => {
  try {
    const { id: chatuser } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, chatuser] },
    }).populate("messages");

    if (!conversation) {
      console.log("ℹ️ No conversation found between users");
      return res.status(201).json({ messages: [] });
    }

    const messages = conversation.messages;
    console.log("📦 Returning messages:", messages.length);
    res.status(201).json({ messages });
  } catch (err) {
    console.error("❌ Message fetching error:", err);
    res.status(500).json({ err: "Internal server error" });
  }
};
