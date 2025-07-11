import { useState } from "react";
import useConversation from "../statemanage/useConversation.js";
import axios from "axios";
import { useSocketContext } from "../context/SocketContext"; // ✅ Access the socket

function useSendMessage() {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { socket } = useSocketContext();

const sendMessages = async (message, file = null) => {
  setLoading(true);
  console.log("🆔 Selected conversation ID:", selectedConversation?._id);



  if (selectedConversation && selectedConversation._id) {
    try {
      let payload;
      let config = {
        withCredentials: true,
        headers: {},
      };

      if (file) {
        payload = new FormData();
        payload.append("message", message || "");
        payload.append("file", file);
        config.headers["Content-Type"] = "multipart/form-data";
      } else {
        payload = { message };
      }

      console.log("📤 Payload:", payload);
      console.log("📤 Config:", config);


      const res = await axios.post(
        `/api/message/send/${selectedConversation._id}`,
        payload,
        config
      );

      const newMessage = res.data.newMessage;
      setMessages([...messages, newMessage]);

      socket?.emit("sendMessage", {
        receiverId: selectedConversation._id,
        message: newMessage,
      });

      console.log("✅ Emitted new message to socket.io");
    } catch (error) {
      console.log("❌ Error in Send Message:", error);
    } finally {
      setLoading(false);
    }
  }
  console.log("📨 Calling sendMessages with:");
  console.log("📝 Text:", message);
  console.log("📁 File:", file);

};


  return {
    loading,
    sendMessages,
  };
}

export default useSendMessage;
