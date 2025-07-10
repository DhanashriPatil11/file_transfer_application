import React, { useState, useEffect } from 'react';
import {
  CssBaseline,
  Container,
  Typography,
  Box,
  Button,
  LinearProgress,
  Paper,
} from '@mui/material';
import socket from './socket';

function App() {
  const [connected, setConnected] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const CHUNK_SIZE = 64 * 1024;

  const handleConnect = () => {
    socket.connect();
    setConnected(true);
  };

  const handleDisconnect = () => {
    socket.disconnect();
    setConnected(false);
    setProgress(0);
    setFile(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setProgress(0);
  };

  const handleFileUpload = () => {
    if (!file) return alert('Please select a file');

    socket.emit('start-upload', { fileName: file.name });

    const fileReader = new FileReader();
    let offset = 0;

    fileReader.onload = (e) => {
      const chunk = new Uint8Array(e.target.result);
      socket.emit('upload-chunk', chunk);

      offset += chunk.length;
      setProgress(Math.min((offset / file.size) * 100, 100));

      if (offset < file.size) {
        readSlice(offset);
      } else {
        socket.emit('upload-complete');
      }
    };

    const readSlice = (o) => {
      const slice = file.slice(o, o + CHUNK_SIZE);
      fileReader.readAsArrayBuffer(slice);
    };

    readSlice(0);
  };

  useEffect(() => {
    socket.on('upload-success', ({ fileName }) => {
      alert(`File "${fileName}" uploaded successfully!`);
      setProgress(100);
    });

    return () => {
      socket.off('upload-success');
    };
  }, []);

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(270deg, #4facfe, #00f2fe)',
          backgroundSize: '400% 400%',
          animation: 'gradientBG 10s ease infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <style>{`
          @keyframes gradientBG {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
          }
        `}</style>

        <Paper elevation={12} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
          <Typography variant="h4" align="center" gutterBottom>
            File Transfer App
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            {!connected ? (
              <Button variant="contained" onClick={handleConnect}>
                Connect to Server
              </Button>
            ) : (
              <Button variant="outlined" color="error" onClick={handleDisconnect}>
                Disconnect
              </Button>
            )}
          </Box>

          {connected && (
            <>
              <input
                type="file"
                onChange={handleFileChange}
                style={{ marginBottom: 10, display: 'block' }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleFileUpload}
                disabled={!file}
              >
                Upload File
              </Button>

              {file && (
                <Box sx={{ mt: 3 }}>
                  <LinearProgress variant="determinate" value={progress} />
                  <Typography align="center" variant="body2" sx={{ mt: 1 }}>
                    {Math.floor(progress)}%
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Box>
    </>
  );
}

export default App;
