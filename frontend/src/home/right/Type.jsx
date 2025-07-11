import React, { useState } from "react";
import { IoSend } from "react-icons/io5";
import { FiPaperclip } from "react-icons/fi";
import { IoClose } from "react-icons/io5"; // ❌ icon
import useSendMessage from "../../context/useSendMessage.js";

function Type() {
  const { loading, sendMessages } = useSendMessage();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !file) return;

    await sendMessages(message, file);
    console.log("✅ Message sent (via useSendMessage)");
    setMessage("");
    setFile(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("📎 File selected:", selectedFile.name);
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    console.log("❌ File selection cleared");
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* ✅ FILE PREVIEW BOX */}
      {file && (
        <div className="w-[70%] mb-2 px-4 py-2 bg-gray-900 text-cyan-300 rounded-lg flex items-center justify-between shadow-md text-sm max-w-[600px] truncate">
          <div className="flex items-center gap-2 overflow-hidden">
            <FiPaperclip className="text-xl" />
            <span className="truncate">{file.name}</span>
          </div>
          <IoClose
            onClick={handleFileRemove}
            className="text-xl cursor-pointer text-red-400 hover:text-red-600"
            title="Remove file"
          />
        </div>
      )}

      {/* ✅ MESSAGE FORM */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-1 w-[70%] z-50 flex items-center bg-black pl-3 pb-1 rounded-lg shadow-lg"
        style={{ minWidth: "300px" }}
      >
        {/* File upload icon */}
        <label className="cursor-pointer text-xl text-neonMagenta mr-2">
          <FiPaperclip />
          <input type="file" hidden onChange={handleFileChange} />
        </label>

        {/* Message input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border-2 border-neonMagenta shadow-sm shadow-neonMagenta bg-cyberNight rounded-lg flex-grow outline-none placeholder-neonCyan text-neonCyan font-sourceSans h-[40px] pl-3 pr-5 mr-3"
          placeholder="Type your message..."
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={loading}
          className="text-2xl rounded-xl text-neonMagenta shadow-md shadow-neonMagenta bg-cyberNavy hover:text-cyberPink hover:shadow-lg hover:shadow-neonCyan hover:scale-105 transition-all duration-300 ease-in-out h-[40px] p-2"
        >
          <IoSend />
        </button>
      </form>
    </div>
  );
}

export default Type;
