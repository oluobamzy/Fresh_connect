import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 6
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 600,
          width: '100%',
          borderRadius: 2,
          textAlign: 'center',
          fontFamily: 'Montserrat'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600} color="error">
          Access Denied
        </Typography>
        
        <Typography variant="body1" paragraph>
          You don't have permission to access this page.
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          If you believe you should have access, please contact an administrator.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/"
            sx={{ fontWeight: 500, fontFamily: 'Montserrat', mr: 2 }}
          >
            Go to Homepage
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/profile"
            sx={{ fontWeight: 500, fontFamily: 'Montserrat' }}
          >
            My Profile
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Unauthorized;
