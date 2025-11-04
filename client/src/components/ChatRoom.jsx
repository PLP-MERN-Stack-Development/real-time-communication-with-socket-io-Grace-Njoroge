import { useState, useEffect } from "react";
import { useSocket, socket } from "../socket/socket";

const reactions = ["👍", "❤️", "😂", "🔥", "😢", "😮"];

export default function ChatRoom() {
  const {
    sendMessage,
    sendPrivateMessage,
    sendReadReceipt,
    readMessages,
    messages,
    users,
    typingUsers,
    setTyping,
    sendReaction,
  } = useSocket();

  

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [privateUser, setPrivateUser] = useState(null);
  const [unread, setUnread] = useState(0);

  const playSound = () => {
    const audio = new Audio("/sounds/ping.mp3");
    audio.play();
  };

  useEffect(() => {
    messages.forEach((msg) => {
      if (!msg.isMine) {
        sendReadReceipt(msg.id);
      }
    });
  }, [messages]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const handleNewNotification = ({ message, sender }) => {
      playSound();
      if (document.hidden) setUnread((prev) => prev + 1);

      if (document.hidden && Notification.permission === "granted") {
        new Notification("New Message", {
          body: `${sender}: ${message}`,
          icon: "/chat-icon.png",
        });
      }
    };

    socket.on("newMessageNotification", handleNewNotification);
    return () => socket.off("newMessageNotification", handleNewNotification);
  }, []);

  useEffect(() => {
    const handleFocus = () => setUnread(0);
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleSend = () => {
    if (!text.trim() && !image) return;
    const payload = {
  message: text || "",
  image: image || null,
  timestamp: new Date().toISOString(),
};


    privateUser ? sendPrivateMessage(privateUser.id, payload) : sendMessage(payload);

    setText("");
    setImage(null);
    setPreview(null);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: "flex", padding: 10 }}>
      
      {/* USERS LIST */}
      <div style={{ width: "200px", padding: 10, borderRight: "1px solid #ccc" }}>
        <h4>Online Users</h4>
        {users.map((u) => (
          <div
            key={u.id}
            onClick={() => setPrivateUser(u)}
            style={{
              cursor: "pointer",
              padding: 6,
              borderRadius: 5,
              background: privateUser?.id === u.id ? "#ddd" : "transparent",
            }}
          >
            ✅ {u.username}
          </div>
        ))}
        {privateUser && (
          <button onClick={() => setPrivateUser(null)}>Cancel Private Chat</button>
        )}
      </div>

      {/* CHAT AREA */}
      <div style={{ flex: 1, padding: 10 }}>
        <h3>Chat Room {unread > 0 && `(${unread})`}</h3>

        <div style={{ height: 400, overflowY: "auto", border: "1px solid #ccc", padding: 10 }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: 10 }}>
              <b>{msg.sender}: </b> {msg.message}
              
              {msg.image && (
                <div>
                  <img src={msg.image} alt="" style={{ width: 150, borderRadius: 5 }} />
                </div>
              )}

              {msg.isMine && (
                <small style={{ marginLeft: 5 }}>
                  {readMessages[msg.id]?.length > 0 ? "✅✅" : "✅"}
                </small>
              )}

              <div style={{ fontSize: 12, color: "gray" }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>

              {/* ✅ Reaction buttons */}
              <div>
                {reactions.map((emoji) => (
                  <button
                    key={emoji}
                    style={{ marginRight: 4, cursor: "pointer" }}
                    onClick={() => sendReaction(msg.id, emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* ✅ Show reactions */}
              {msg.reactions && (
                <div style={{ marginTop: 4 }}>
                  {Object.values(msg.reactions).map((emoji, i) => (
                    <span key={i} style={{ marginRight: 5 }}>{emoji}</span>
                  ))}
                </div>
              )}

            </div>
          ))}

          {typingUsers.length > 0 && (
            <i>{typingUsers.join(", ")} typing...</i>
          )}
        </div>

        {preview && (
          <div style={{ margin: "10px 0" }}>
            <img src={preview} style={{ width: 80, borderRadius: 5 }} />
            <button onClick={() => { setPreview(null); setImage(null); }}>❌</button>
          </div>
        )}

        <input
          placeholder="Type a message..."
          value={text}
          onChange={(e) => { setText(e.target.value); setTyping(true); }}
          onBlur={() => setTyping(false)}
          style={{ width: "60%" }}
        />

        <input type="file" accept="image/*" onChange={handleImageSelect} />

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}


