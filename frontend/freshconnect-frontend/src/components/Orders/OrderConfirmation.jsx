import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Container, 
  Button, 
  Divider, 
  Grid, 
  Chip,
  CircularProgress
} from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import OrderService from '../../services/OrderService';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        // Use OrderService instead of direct fetch
        const data = await OrderService.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);
  
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your order confirmation...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          There was a problem loading your order details
        </Typography>
        <Typography variant="body1" paragraph>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          component={Link} 
          to="/orders"
          color="primary"
        >
          View All Orders
        </Button>
      </Container>
    );
  }
  
  // Mock data for demonstration
  const mockOrder = {
    id: orderId || 'ORD-12345',
    date: new Date().toLocaleDateString(),
    status: 'Processing',
    items: [
      { name: 'Fresh Apples', quantity: 2, price: 3.5 },
      { name: 'Organic Carrots', quantity: 1, price: 2.5 }
    ],
    shipping: 5,
    total: 14.5,
    deliveryAddress: {
      fullName: 'John Doe',
      addressLine1: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    },
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
  };
  
  const orderData = order || mockOrder;
  
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Thank You for Your Order!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Your order has been placed successfully
          </Typography>
        </Box>
        
        <Box sx={{ mb: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Order Number:</strong> {orderData.id}
              </Typography>
              <Typography variant="body1">
                <strong>Order Date:</strong> {orderData.date}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Chip 
                  icon={<AccessTimeIcon />} 
                  label={`Status: ${orderData.status}`} 
                  color="primary" 
                  sx={{ fontWeight: 500 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Order Details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {orderData.items.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1">
              {item.quantity} × {item.name}
            </Typography>
            <Typography variant="body1">
              ${(item.price * item.quantity).toFixed(2)}
            </Typography>
          </Box>
        ))}
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1">Subtotal</Typography>
          <Typography variant="body1">
            ${(orderData.total - orderData.shipping).toFixed(2)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1">Shipping</Typography>
          <Typography variant="body1">${orderData.shipping.toFixed(2)}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Total</Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>${orderData.total.toFixed(2)}</Typography>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Shipping Address
            </Typography>
            <Typography variant="body2">
              {orderData.deliveryAddress.fullName}
            </Typography>
            <Typography variant="body2">
              {orderData.deliveryAddress.addressLine1}
            </Typography>
            <Typography variant="body2">
              {orderData.deliveryAddress.city}, {orderData.deliveryAddress.state} {orderData.deliveryAddress.zipCode}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Delivery Information
              </Typography>
            </Box>
            <Typography variant="body2">
              <strong>Estimated Delivery:</strong> {orderData.estimatedDelivery}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              You will receive shipping updates via email.
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to={`/orders/${orderId}`}
          >
            Track Order
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            component={Link} 
            to="/marketplace"
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderConfirmation;
