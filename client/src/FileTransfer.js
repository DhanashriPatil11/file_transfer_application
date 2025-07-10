import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, Button, Box, Input, LinearProgress } from '@mui/material';

function FileTransfer() {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleRestUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      alert(`File uploaded successfully: ${res.data.fileName}`);
    } catch (err) {
      alert('Upload failed');
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        📁 File Transfer (REST)
      </Typography>

      <Box my={2}>
        <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
      </Box>

      <Button variant="contained" color="primary" onClick={handleRestUpload}>
        Upload via REST API
      </Button>

      {uploadProgress > 0 && (
        <Box mt={3}>
          <Typography variant="body2">Uploading... {uploadProgress}%</Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}
    </Container>
  );
}

export default FileTransfer;
