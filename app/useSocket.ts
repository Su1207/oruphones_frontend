import { useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://oruphones-server.onrender.com";

const useSocket = (): Socket => {
  const socket = useMemo(() => io(SOCKET_URL), []); // Memoize the socket instance

  useEffect(() => {
    // Ensure that the connection is established only once
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      // Disconnect the socket when the component unmounts
      socket.disconnect();
    };
  }, [socket]);

  return socket;
};

export default useSocket;
