import { useLayoutEffect, useRef, useState } from "react";
import { players, useStore } from "../store/store";

const ChatPanel = () => {
  const [input, setInput] = useState("");

  const chat = useStore((state) => state.messages);
  const mainPlayerId = useStore((state) => state.mainPlayerId);

  const messagesListRef = useRef<HTMLDivElement>(null!);

  const addMessage = () => {
    if (!input.trim()) return;
    setInput("");
    players.get(mainPlayerId)?.sendMessage(input);
  };

  useLayoutEffect(() => {
    // const height = messagesListRef.current.scrollHeight;
    // messagesListRef.current.style.height = `${height}px`;
    messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
  }, [chat]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <span className="text-lg">🗨️</span>
        <h1>Chat</h1>
      </div>
      <div className="flex flex-col overflow-hidden rounded border border-gray-700 bg-gray-800">
        <div className="flex h-64 flex-col justify-end bg-gray-900 p-2 transition-all duration-500">
          <div
            className="flex flex-col gap-2 overflow-y-auto transition-all duration-500"
            ref={messagesListRef}
          >
            {Array.from(chat.values()).map((message, index) => (
              <div
                key={index}
                className="animate-grow flex max-h-12 shrink-0 items-start gap-1 transition-all duration-300"
              >
                <span
                  className="text-xs font-bold uppercase"
                  style={{
                    color: players.get(message.senderId)?.color ?? "gray",
                  }}
                >
                  {message.sender}
                </span>{" "}
                <p className="rounded bg-gray-600 px-2 text-xs">
                  {message.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 p-2">
          <input
            type="text"
            className="flex-1 rounded bg-gray-900 p-2 text-sm"
            placeholder="type your message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={addMessage}
            className="min-w-24 rounded bg-gradient-to-r from-pink-700 to-orange-600 p-2 hover:from-pink-600 hover:to-orange-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
