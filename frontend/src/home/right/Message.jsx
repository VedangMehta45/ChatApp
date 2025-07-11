function Message({ message, previousMessage }) {
  const actualMessage = message?.newMessage || message;

  if (!actualMessage || !actualMessage._id) {
    console.error("Invalid message object:", actualMessage);
    return null;
  }

  const authUser = JSON.parse(localStorage.getItem("messenger"));
  if (!authUser || !authUser.user || !authUser.user._id) {
    console.error("Auth user is not available or has an incorrect structure.");
    return null;
  }

  const isMyMessage = actualMessage.senderId === authUser.user._id;
  const chatClass = isMyMessage ? "chat-end pr-2" : "chat-start pl-2";
  const chatColor = isMyMessage ? "bg-neonCyan" : "bg-lavenderBlue";

  const createdAt = new Date(actualMessage.createdAt);
  const formattedTime = createdAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = createdAt.toLocaleDateString();

  let showDate = false;
  if (
    !previousMessage ||
    new Date(previousMessage.createdAt).toLocaleDateString() !== formattedDate
  ) {
    showDate = true;
  }

  const isImage = actualMessage.file && actualMessage.file.match(/\.(jpeg|jpg|png|gif|webp)$/i);
  const isPDF = actualMessage.file && actualMessage.file.endsWith(".pdf");
  const isOtherFile = actualMessage.file && !isImage && !isPDF;

  return (
    <div className="pt-3 pl-3 p-2">
      {showDate && (
        <div className="text-center text-sm font-bold font-robotoMono my-2">
          {formattedDate}
        </div>
      )}
      <div className={chatClass}>
        <div
          className={`chat-bubble chat-bubble-accent ${chatColor} font-sansSarif text-md shadow-md max-w-xs break-words`}
        >
          {/* Show text message */}
          {actualMessage.message && <p>{actualMessage.message}</p>}

          {/* Show image */}
          {isImage && (
            <img
              src={`http://localhost:4001/uploads/${actualMessage.file}`}
              alt="sent-img"
              className="mt-2 max-w-[200px] rounded-lg"
            />
          )}

          {/* Show PDF */}
          {isPDF && (
            <a
              href={`http://localhost:4001/uploads/${actualMessage.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-100 underline"
            >
              📄 View PDF
            </a>
          )}

          {/* Show other file types */}
          {isOtherFile && (
            <a
              href={`http://localhost:4001/uploads/${actualMessage.file}`}
              download
              className="text-cyan-100 underline"
            >
              📎 Download file
            </a>
          )}
        </div>
        <div className="text-xs font-robotoMono">{formattedTime}</div>
      </div>
    </div>
  );
}

export default Message;
