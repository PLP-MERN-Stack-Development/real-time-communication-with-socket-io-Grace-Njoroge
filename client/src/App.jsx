import { useState } from "react";
import { useSocket } from "./socket/socket";
import Join from "./components/Join";
import ChatRoom from "./components/ChatRoom";

function App() {
  const [joined, setJoined] = useState(false);

  const { connect, messages, users, typingUsers, sendMessage, setTyping } = useSocket();

  const handleJoin = (username, room) => {
  connect({ username, room });
  setJoined(true);
};


  return (
    <div>
      {!joined ? (
        <Join onJoin={handleJoin} />
      ) : (
        <ChatRoom 
          messages={messages}
          users={users}
          typingUsers={typingUsers}
          sendMessage={sendMessage}
          setTyping={setTyping}
        />
      )}
    </div>
  );
}

export default App;



