import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from './AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state or default to homepage
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setFormError('Email and password are required');
      return;
    }

    try {
      setSubmitting(true);
      setFormError('');
      await login(email, password);
      
      // Redirect to the page user tried to access or homepage
      navigate(from, { replace: true });
    } catch (error) {
      setFormError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4
      }}
    >
      <Paper 
        elevation={3}
        sx={{
          p: 4, 
          maxWidth: 500,
          width: '100%',
          borderRadius: 2,
          fontFamily: 'Montserrat'
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom align="center" fontWeight={600}>
          Log In to FreshConnect
        </Typography>
        
        <Typography variant="body2" color="text.secondary" mb={3} align="center">
          Access your account to browse fresh produce, manage orders, and more.
        </Typography>

        {formError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {formError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ sx: { fontFamily: 'Montserrat' } }}
            InputProps={{ sx: { fontFamily: 'Montserrat' } }}
            required
          />
          
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ sx: { fontFamily: 'Montserrat' } }}
            InputProps={{
              sx: { fontFamily: 'Montserrat' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    aria-label={showPassword ? 'hide password' : 'show password'}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            required
          />
          
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 3, mb: 2, fontWeight: 600, py: 1.2, fontFamily: 'Montserrat' }}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
          </Button>
        </form>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" sx={{ fontFamily: 'Montserrat' }}>
            Don't have an account?{' '}
            <Link to="/onboarding" style={{ color: '#4CAF50', textDecoration: 'none' }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
