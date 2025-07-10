// client/src/pages/LoginPage.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import {
  Container, TextField, Button, Typography, Box
} from '@mui/material';
import { AuthContext } from '../AuthContext';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username, password
      });
      login(res.data.token);
      onLogin();
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" sx={{ mt: 5 }}>Login</Typography>
      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        <TextField label="Username" onChange={(e) => setUsername(e.target.value)} />
        <TextField label="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" onClick={handleLogin}>Login</Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
