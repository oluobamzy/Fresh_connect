import { useState } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import FormInput from '../FormInput';
import Loader from '../Loader';
import Notification from '../Notification';

export default function EmailVerification({ email }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setNotification({ open: true, message: 'Email verified! You can now log in.', severity: 'success' });
      } else {
        setError(data.message || 'Verification failed.');
        setNotification({ open: true, message: data.message || 'Verification failed.', severity: 'error' });
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
      <Typography variant="h5" mb={2}>Email Verification</Typography>
      <Typography mb={2}>Enter the verification code sent to your email: <b>{email}</b></Typography>
      <form onSubmit={handleSubmit}>
        <FormInput label="Verification Code" name="code" value={code} onChange={e => setCode(e.target.value)} required />
        {loading ? <Loader /> : <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Verify Email</Button>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>Email verified! You can now log in.</Alert>}
      </form>
      <Notification open={notification.open} message={notification.message} severity={notification.severity} onClose={() => setNotification({ ...notification, open: false })} />
    </Box>
  );
}
