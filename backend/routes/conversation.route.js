import express from "express";
import Conversation from "../models/conversation.model.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();

router.get("/", secureRoute, async (req, res) => {
  try {
    const userId = req.user._id.toString();

    // Find conversations where the logged-in user is a participant
    const conversations = await Conversation.find({
      participants: userId,
    }).populate("participants", "-password -__v");

    // Extract the other participant (the chat user)
    const chatUsers = conversations.map((conv) =>
      conv.participants.find(
        (participant) => participant._id.toString() !== userId
      )
    );

    res.json(chatUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
});

export default router;
