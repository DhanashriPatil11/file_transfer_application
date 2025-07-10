import { io } from 'socket.io-client';

// Debug line
console.log("SOCKET_URL:", process.env.REACT_APP_SOCKET_URL);

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export default socket;
