import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import Message from "./Message";
import Loading from "../../components/Loading.jsx";
import useGetMessage from "../../context/useGetMessage.js";
import { useSocketContext } from "../../context/SocketContext.jsx"; //  socket

function Messages() {
  const { messages, loading, error } = useGetMessage();
  const { socket } = useSocketContext(); //  get socket instance
  const [localMessages, setLocalMessages] = useState([]); //  local messages for real-time update
  const containerRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  //  Sync fetched messages to local state initially
  useEffect(() => {
    if (messages?.length) {
      console.log("📩 Initial messages from DB:", messages);
      setLocalMessages(messages);
    }
  }, [messages]);



  //  Listen for real-time incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      console.log("📥 New message received via socket in Messages.jsx:", newMessage);
      setLocalMessages((prev) => [...prev, newMessage]);
    };

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket]);

  //  Auto-scroll to bottom unless user is manually scrolling
  useLayoutEffect(() => {
    if (!isUserScrolling) {
      const container = containerRef.current;
      if (container) container.scrollTop = container.scrollHeight;
    }
  }, [localMessages, isUserScrolling]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const isAtBottom =
        container.scrollHeight - container.scrollTop === container.clientHeight;
      setIsUserScrolling(!isAtBottom);
    }
  };

  // Loading state
  if (loading) return <Loading />;

  //  Error state
  if (error)
    return (
      <div className="error-message flex h-screen items-center justify-center text-center font-semibold text-xl">
        <p>{error}</p>
      </div>
    );

  //  Invalid or no message state
  if (!Array.isArray(messages) || localMessages.length === 0) {
    return (
      <div className="no-messages flex h-screen items-center justify-center text-center font-semibold text-xl">
        <p>No messages yet. Let's start the conversation now</p>
      </div>
    );
  }

  return (
    <div
      className="messages-container"
      ref={containerRef}
      onScroll={handleScroll}
      style={{ overflowY: "auto", height: "100%" }}
    >
      {localMessages.map((message, index) => (
        <Message
          key={message._id}
          message={message}
          previousMessage={index > 0 ? localMessages[index - 1] : null}
        />
      ))}
    </div>
  );
}

export default Messages;
