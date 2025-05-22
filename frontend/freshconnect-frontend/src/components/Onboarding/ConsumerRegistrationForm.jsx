import { useState } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import FormInput from '../FormInput';
import Loader from '../Loader';
import Notification from '../Notification';

export default function ConsumerRegistrationForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '', foodPreferences: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'consumer' })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setNotification({ open: true, message: 'Registration successful! You can now log in.', severity: 'success' });
        setForm({ name: '', email: '', password: '', foodPreferences: '' });
      } else {
        setError(data.message || 'Registration failed.');
        setNotification({ open: true, message: data.message || 'Registration failed.', severity: 'error' });
      }
    } catch (err) {
      setError('Network error.');
      setNotification({ open: true, message: 'Network error.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4}>
      <Typography variant="h5" mb={2}>Consumer Registration</Typography>
      <form onSubmit={handleSubmit}>
        <FormInput label="Name" name="name" value={form.name} onChange={handleChange} required />
        <FormInput label="Email" name="email" value={form.email} onChange={handleChange} type="email" required />
        <FormInput label="Password" name="password" value={form.password} onChange={handleChange} type="password" required />
        <FormInput label="Food Preferences" name="foodPreferences" value={form.foodPreferences} onChange={handleChange} />
        {loading ? <Loader /> : <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Register</Button>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>Registration successful! You can now log in.</Alert>}
      </form>
      <Notification open={notification.open} message={notification.message} severity={notification.severity} onClose={() => setNotification({ ...notification, open: false })} />
    </Box>
  );
}
