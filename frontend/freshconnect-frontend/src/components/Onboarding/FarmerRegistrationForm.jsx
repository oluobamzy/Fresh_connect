import { useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FormInput from '../FormInput';
import Notification from '../Notification';
import { useAuth } from '../../components/Auth/AuthContext';

export default function FarmerRegistrationForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '', farmDetails: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Convert farmDetails to JSON format if it's not empty
      const farmDetailsJSON = form.farmDetails ? 
        JSON.stringify({ description: form.farmDetails }) : '';
      
      const userData = { 
        ...form, 
        role: 'farmer',
        farmDetails: farmDetailsJSON 
      };
      
      console.log('Submitting farmer data:', userData);
      const result = await register(userData);
      
      setSuccess(true);
      setNotification({ 
        open: true, 
        message: 'Registration successful! Please check your email for verification.', 
        severity: 'success' 
      });
      setForm({ name: '', email: '', password: '', farmDetails: '' });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Farmer registration error:', err);
      setError(err.message || 'Registration failed.');
      setNotification({ 
        open: true, 
        message: err.message || 'Registration failed.', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={500} mx="auto">
      {notification.open && (
        <Notification
          type={notification.severity}
          message={notification.message}
          onClose={() => setNotification({ ...notification, open: false })}
        />
      )}

      {error && !notification.open && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && !notification.open && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Registration successful! Please check your email for verification.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <FormInput 
          label="Farm or Business Name" 
          name="name" 
          value={form.name} 
          onChange={handleChange} 
          required 
        />
        <FormInput 
          label="Email Address" 
          name="email" 
          value={form.email} 
          onChange={handleChange} 
          type="email" 
          required 
        />
        <FormInput 
          label="Password" 
          name="password" 
          value={form.password} 
          onChange={handleChange} 
          type="password" 
          required 
          helperText="Password must be at least 8 characters"
        />
        <FormInput 
          label="Farm Details" 
          name="farmDetails" 
          value={form.farmDetails} 
          onChange={handleChange} 
          multiline 
          rows={4}
          required
          helperText="Please describe your farm, products, and farming practices"
        />
        
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          size="large"
          fullWidth
          disabled={loading}
          sx={{ mt: 3, fontWeight: 600, py: 1.2, fontFamily: 'Montserrat' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Apply as Farmer'}
        </Button>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          Farmer accounts require verification before activation.
          We'll review your application and notify you by email.
        </Typography>
      </form>
    </Box>
  );
}
