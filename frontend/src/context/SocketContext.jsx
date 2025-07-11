import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocketContext = () => useContext(SocketContext);

let socket;

export const SocketProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem("messenger"));
    const userId = authUser?.user?._id ;
    console.log("🔌 Connecting socket with userId:", userId);

    if (!userId) {
      console.warn("⚠️ No user ID found. Not connecting socket.");
      return;
    }

    if (!socketRef.current) {
      socketRef.current = io("ws://localhost:4001", {
        query: { userId },
      });

      socket = socketRef.current;

      socket.on("connect", () => {
        console.log("✅ WebSocket connected:", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("🔌 WebSocket disconnected");
      });

      socket.on("onlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        socket.close();
        console.log("🔌 Socket closed");
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
