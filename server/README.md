# Real-Time Chat Application

A real-time chat application built with Socket.IO, React, and Node.js that enables users to communicate in real-time with features like private messaging, typing indicators, and message reactions.

## 🚀 Features

- Real-time messaging with Socket.IO
- Room-based chat system
- Private messaging between users
- Typing indicators
- Message reactions
- Read receipts
- User join/leave notifications
- Image sharing support
- Message history with pagination
- Search functionality
- User presence tracking

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Real-time Communication**: Socket.IO
- **Styling**: CSS/SCSS
- **Environment Variables**: dotenv

## 📝 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (if using database features)

## ⚙️ Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/PLP-MERN-Stack-Development/real-time-communication-with-socket-io-Grace-Njoroge.git
cd real-time-communication-with-socket-io-Grace-Njoroge
```

2. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Environment Variables**

Create `.env` files in both client and server directories:

Server `.env`:
```plaintext
PORT=5000
CLIENT_URL=http://localhost:5173
```

Client `.env`:
```plaintext
VITE_SOCKET_URL=http://localhost:5000
```

4. **Start the application**
```bash
# Start server (from server directory)
npm run dev

# Start client (from client directory)
npm run dev
```

## 🎯 Features Implemented

### 1. Real-time Communication
- Instant message delivery
- Typing indicators
- Online/offline status

### 2. Chat Rooms
- Multiple chat room support
- Room-specific message history
- User join/leave notifications

### 3. Message Features
- Text messages
- Image sharing
- Message reactions
- Read receipts
- Message search

### 4. User Experience
- Clean, responsive UI
- Real-time user list
- Typing indicators
- Join/leave notifications

## 🔧 Usage

1. Open the application in your browser
2. Enter your username and select a room
3. Start chatting!
4. Use "@username" to send private messages
5. Click on messages to add reactions
6. Use the search bar to find specific messages

## 📱 Screenshots

### Login Screen
![Login Screen](screenshots/login.png)!
*Users can enter their name and select a chat room*

### Chat Interface
![Chat Interface](screenshots/chat.png)
*Main chat interface showing online users, messages, and reactions*

### Typing Indicator
![Typing Indicator](screenshots/typing.png)!
*Real-time typing indicator when users are composing messages*



## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

Grace Njoroge

## 🙏 Acknowledgments

- Socket.IO team for the amazing real-time engine
- PLP MERN Stack Development Program