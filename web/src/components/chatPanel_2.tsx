import { useEffect, useState } from "react";
import io from "socket.io-client";

// TODO: need to be refactored
const socket = io();

const ChatPanel = () => {
  const [room, setRoom] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { userName: string; message: string }[]
  >([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.on(
      "message",
      (data: { userId: string; userName: string; message: string }) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      },
    );

    socket.on(
      "roomHistory",
      (data: { userName: string; message: string }[]) => {
        setMessages(data);
      },
    );

    return () => {
      socket.off("message");
    };
  }, []);

  const joinRoom = () => {
    if (room.trim() !== "" && userName.trim() !== "") {
      socket.emit("joinRoom", room);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim() !== "" && room.trim() !== "" && userName.trim() !== "") {
      socket.emit("message", { room, message, userName });
      setMessage("");
    }
  };

  return (
    <div className="App">
      <h1>Chat Room</h1>
      {!joined ? (
        <>
          <input
            type="text"
            placeholder="Enter room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </>
      ) : (
        <>
          <h2>Room: {room}</h2>
          <input
            type="text"
            placeholder="Enter message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send Message</button>
          <div>
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.userName}:</strong> {msg.message}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPanel;
