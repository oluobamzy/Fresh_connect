import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Box, Tabs, Tab, Typography, Paper } from '@mui/material';
import OrderList from './Orders/OrderList';
import OrderDetails from './Orders/OrderDetails';

// This component will serve as the container for all order-related views
const OrdersContainer = () => {
  // In a real app, this would come from authentication context
  const [userRole, setUserRole] = useState('consumer');
  const navigate = useNavigate();

  // Switch between consumer and farmer roles (temporary for demo purposes)
  const handleRoleChange = (event, newValue) => {
    setUserRole(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Order Management
      </Typography>
      
      {/* Role switcher for demo purposes */}
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={userRole} 
            onChange={handleRoleChange} 
            aria-label="role tabs"
          >
            <Tab label="Consumer View" value="consumer" />
            <Tab label="Farmer View" value="farmer" />
          </Tabs>
        </Box>
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {userRole === 'consumer' 
              ? 'You are viewing orders as a consumer. You can track your purchases and view order history.'
              : 'You are viewing orders as a farmer. You can manage and update order statuses for customers.'}
          </Typography>
        </Box>
      </Paper>

      <Routes>
        <Route index element={<OrderList userRole={userRole} />} />
        <Route path=":orderId" element={<OrderDetails userRole={userRole} />} />
      </Routes>
    </Box>
  );
};

export default OrdersContainer;
