import { useState } from "react";
import { useStore } from "../store/store";

const RegisterPanel = () => {
  const [newUsername, setNewUsername] = useState("");
  const setUsername = useStore((state) => state.setUsername);

  return (
    <div className="flex flex-col rounded bg-gray-800 border-gray-700 border">
      <h1 className="flex flex-1 items-center justify-center text-xl text-gray-200">
        Welcome
      </h1>
      <div className="flex flex-1 flex-col gap-2 p-2">
        <span className="text-center text-sm text-gray-400">
          Please insert your name
        </span>
        <input
          type="text"
          className="rounded bg-gray-900 p-2 text-sm"
          onChange={(e) => setNewUsername(e.target.value.trim())}
        />
        <button
          className="rounded bg-gray-500 p-2 text-sm font-bold text-white hover:bg-gray-600 active:bg-gray500"
          onClick={() => {
            if (!newUsername) return;
            setUsername(newUsername);
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default RegisterPanel;
