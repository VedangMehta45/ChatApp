import React, { useState } from "react";
import useConversation from "../statemanage/useConversation.js";
import axios from "axios";

function useSendMessage() {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessages = async (message) => {
    setLoading(true);
    console.log("Selected conversation ID:", selectedConversation?._id);

    if (selectedConversation && selectedConversation._id) {
      try {
        const res = await axios.post(
          `/api/message/send/${selectedConversation._id}`,
          { message },
          { withCredentials: true } // in case you're using cookies for JWT
        );

        setMessages([...messages, res.data.newMessage]); // ✅ Fix: use newMessage
      } catch (error) {
        console.log("Error in Send Message: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    loading,
    sendMessages,
  };
}

export default useSendMessage;
