import React, { useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab } from '@mui/material';
import FarmerRegistrationForm from './FarmerRegistrationForm';
import ConsumerRegistrationForm from './ConsumerRegistrationForm';

/**
 * Registration page with tabs for consumer and farmer registration
 */
const Registration = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
          maxWidth: 700,
          width: '100%',
          borderRadius: 2,
          fontFamily: 'Montserrat'
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom align="center" fontWeight={600}>
          Join FreshConnect
        </Typography>
        
        <Typography variant="body2" color="text.secondary" mb={4} align="center">
          Sign up to buy and sell fresh produce directly from local farmers
        </Typography>

        <Box sx={{ width: '100%' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            indicatorColor="primary"
            textColor="primary"
            sx={{ mb: 3 }}
          >
            <Tab label="I'm a Consumer" sx={{ fontFamily: 'Montserrat', fontWeight: 500 }} />
            <Tab label="I'm a Farmer" sx={{ fontFamily: 'Montserrat', fontWeight: 500 }} />
          </Tabs>

          <Box hidden={tabValue !== 0} id="consumer-panel">
            {tabValue === 0 && <ConsumerRegistrationForm />}
          </Box>

          <Box hidden={tabValue !== 1} id="farmer-panel">
            {tabValue === 1 && <FarmerRegistrationForm />}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Registration;
