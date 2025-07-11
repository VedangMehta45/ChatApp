import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      default: "",
      trim: true,
      maxLength: 1000,
    },
    file: {
      type: String, // store the filename (or path if needed)
      default: null,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
