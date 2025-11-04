import React from "react";

const reactions = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

export default function MessageBubble({ message, currentUser, onReact }) {
  const userReaction = message.reactions?.[currentUser];

  return (
    <div className="message-item">
      <p><strong>{message.sender}:</strong> {message.message}</p>
      <small>{new Date(message.timestamp).toLocaleTimeString()}</small>

      <div className="reaction-bar">
        {reactions.map((emoji) => (
          <span
            key={emoji}
            className={`reaction-btn ${userReaction === emoji ? "active" : ""}`}
            onClick={() => onReact(message.id, emoji)}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* Show all reactions */}
      <div className="reaction-list">
        {message.reactions &&
          Object.values(message.reactions).map((emoji, i) => (
            <span key={i}>{emoji}</span>
          ))}
      </div>
    </div>
  );
}
