import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import Message from "./Message";
import Loading from "../../components/Loading.jsx";
import useGetMessage from "../../context/useGetMessage.js";

function Messages() {
  const { messages, loading, error } = useGetMessage();
  const containerRef = useRef(null); // Reference to the messages container
  const [isUserScrolling, setIsUserScrolling] = useState(false); // Flag to check if the user is manually scrolling

  // Scroll to the bottom function
  const scrollToBottom = () => {
    const container = containerRef.current;
    if (container) {
      console.log("Scrolling to bottom...");
      container.scrollTop = container.scrollHeight; // Scroll to the bottom of the container
    }
  };

  // Check if the user is manually scrolling up or down
  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const isAtBottom =
        container.scrollHeight - container.scrollTop === container.clientHeight;

      setIsUserScrolling(!isAtBottom); // Set the flag if the user is not at the bottom
    }
  };

  // Auto-scroll to the bottom when messages change and when the component mounts
  useLayoutEffect(() => {
    if (!isUserScrolling) {
      scrollToBottom(); // Scroll only if the user is not scrolling manually
    }
  }, [messages, isUserScrolling]); // Trigger when messages change or user scrolling flag changes

  // Handle loading state
  if (loading) {
    return <Loading />;
  }

  // Error handling if messages is not an array
  if (!Array.isArray(messages)) {
    return (
      <div className="error-message">
        <p>
          Invalid message data received. Try refreshing the page or log in
          again.
        </p>
      </div>
    );
  }

  // Handle no messages
  if (messages.length === 0) {
    return (
      <div className="no-messages flex h-screen items-center justify-center text-center font-semibold text-xl">
        <p>No messages yet. Let's start the conversation now</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="error-message flex h-screen items-center justify-center text-center font-semibold text-xl">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div
      className="messages-container"
      ref={containerRef} // Attach the ref here
      onScroll={handleScroll} // Detect user scroll
      style={{ overflowY: "auto", height: "100%" }} // Ensure the container is scrollable
    >
      {messages.map((message, index) => {
        console.log("Rendering message with key:", message._id);
        return (
          <Message
            key={message._id}
            message={message}
            previousMessage={index > 0 ? messages[index - 1] : null}
          />
        );
      })}
    </div>
  );
}

export default Messages;
