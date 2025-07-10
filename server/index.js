require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/fileRoutes');


const uploadRoute = require('./routes/upload');
app.use('/api/upload', uploadRoute);

app.use('/api/auth', authRoutes);
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // adjust in production
  },
});

const uploadsDir = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('Uploads folder created');
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

// MongoDB connection and server start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Socket.io events for file upload
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  let writeStream = null;
  let fileName = '';

  socket.on('start-upload', (data) => {
    fileName = data.fileName;
    const uploadPath = path.join(uploadsDir, fileName);

    writeStream = fs.createWriteStream(uploadPath);
    console.log('Upload started for', fileName);
  });

  socket.on('upload-chunk', (chunk) => {
    if (writeStream) {
      writeStream.write(Buffer.from(chunk));
    }
  });

  socket.on('upload-complete', () => {
    if (writeStream) {
      writeStream.end();
      console.log('Upload completed for', fileName);
      socket.emit('upload-success', { fileName });
    }
  });

  socket.on('disconnect', () => {
    if (writeStream) {
      writeStream.end();
    }
    console.log('Client disconnected', socket.id);
  });
});
