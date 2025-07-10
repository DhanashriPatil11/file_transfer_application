// client/src/pages/RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import {
  Container, TextField, Button, Typography, Box
} from '@mui/material';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username, password
      });
      alert('Registered successfully. Now login.');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" sx={{ mt: 5 }}>Register</Typography>
      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        <TextField label="Username" onChange={(e) => setUsername(e.target.value)} />
        <TextField label="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" onClick={handleRegister}>Register</Button>
      </Box>
    </Container>
  );
};

export default RegisterPage;
