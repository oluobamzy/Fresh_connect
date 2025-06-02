import { useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FormInput from '../FormInput';
import Notification from '../Notification';
import { useAuth } from '../../components/Auth/AuthContext';

export default function ConsumerRegistrationForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '', foodPreferences: '' });
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
      // Convert foodPreferences to JSON format if it's not empty
      const foodPreferencesJSON = form.foodPreferences ? 
        JSON.stringify({ preferences: form.foodPreferences.split(',').map(item => item.trim()) }) : '';
      
      const userData = { 
        ...form, 
        role: 'consumer',
        foodPreferences: foodPreferencesJSON
      };
      
      console.log('Submitting user data:', userData);
      const result = await register(userData);
      
      setSuccess(true);
      setNotification({ 
        open: true, 
        message: 'Registration successful! You can now log in.', 
        severity: 'success' 
      });
      setForm({ name: '', email: '', password: '', foodPreferences: '' });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
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
          Registration successful! You can now log in.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <FormInput 
          label="Full Name" 
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
          label="Food Preferences (Optional)" 
          name="foodPreferences" 
          value={form.foodPreferences} 
          onChange={handleChange} 
          multiline 
          rows={3}
          helperText="E.g. Vegetarian, Organic only, Local produce, etc."
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
          {loading ? <CircularProgress size={24} /> : 'Create Consumer Account'}
        </Button>
      </form>
    </Box>
  );
}
