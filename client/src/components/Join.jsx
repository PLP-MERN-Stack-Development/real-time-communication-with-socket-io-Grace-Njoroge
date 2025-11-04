import { useState } from "react";

export default function Join({ onJoin }) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("general");

  return (
    <div style={{ padding: 30 }}>
      <h2>Welcome to Chat App</h2>

      <input 
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /><br/><br/>

      <select value={room} onChange={e => setRoom(e.target.value)}>
        <option value="general">General</option>
        <option value="tech">Tech</option>
        <option value="students">Students</option>
        <option value="random">Random</option>
      </select>

      <button style={{ marginLeft: 10 }} onClick={() => onJoin(username, room)}>
        Join Chat
      </button>
    </div>
  );
}

