import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '', role: 'consumer' });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/register`,
        form
      );
      setMessage('Registration successful.');
      setIsSuccess(true);
      setForm({ username: '', password: '', role: 'consumer' });
    } catch (err) {
      // show backend error message if available
      setMessage(err.response?.data?.message || 'Registration failed.');
      setIsSuccess(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h5" mb={2}>Register</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
        <InputLabel id="role-label">Role</InputLabel>
        <Select
          labelId="role-label"
          id="role-select"
          value={form.role}
          label="Role"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="consumer">Consumer</MenuItem>
        </Select>
        </FormControl>
        <Button type="submit" variant="outlined" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>
      </Box>

      {message && (
        <Typography sx={{ mt: 2 }} color={isSuccess ? 'green' : 'error'}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default Register;
