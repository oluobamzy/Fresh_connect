import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Button,
  CircularProgress,
  Paper,
  Avatar,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NoteIcon from '@mui/icons-material/Note';
import EmailIcon from '@mui/icons-material/Email';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import OrderStatusTracker from './OrderStatusTracker';
import OrderService from '../../services/OrderService';

// Status color mapping for the chips
const statusColors = {
  'Pending': 'warning',
  'Confirmed': 'info',
  'Processing': 'primary',
  'Ready': 'secondary',
  'Delivered': 'success',
  'Cancelled': 'error'
};

const OrderDetails = ({ userRole }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Determine if the user can edit the order (farmers can update status)
  const isEditable = userRole === 'farmer';
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const data = await OrderService.getOrderById(orderId);
        setOrder(data);
        setError(null);
      } catch (err) {
        setError('Failed to load order details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);
  
  // Handle order status updates (for farmers)
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await OrderService.updateOrderStatus(id, newStatus);
      // Update the local state with the new status
      setOrder(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      setError('Failed to update order status. Please try again.');
      console.error(err);
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box mt={4}>
        <Paper elevation={3} sx={{ p: 3, bgcolor: '#fff9f9' }}>
          <Typography color="error">{error}</Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => navigate('..')}
          >
            Back to Orders
          </Button>
        </Paper>
      </Box>
    );
  }
  
  if (!order) {
    return (
      <Box mt={4}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography>Order not found or you don't have permission to view it.</Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => navigate('..')}
          >
            Back to Orders
          </Button>
        </Paper>
      </Box>
    );
  }

  // Calculate order total
  const orderTotal = order.productItems.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  );
  
  return (
    <Box mt={4}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton 
          onClick={() => navigate('..')}
          sx={{ mr: 2 }}
          aria-label="back to orders"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h2">
          Order Details
        </Typography>
      </Box>
      
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" mb={2}>
            <Box>
              <Typography variant="h5" component="h2">
                {order.id}
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <DateRangeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography color="textSecondary">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at {' '}
                  {new Date(order.createdAt).toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip 
                label={order.status} 
                color={statusColors[order.status] || 'default'}
                sx={{ fontWeight: 'bold' }}
              />
              <Chip 
                label={order.paymentStatus} 
                color={
                  order.paymentStatus === 'Paid' ? 'success' : 
                  order.paymentStatus === 'Refunded' ? 'error' : 
                  'warning'
                }
                variant="outlined"
                sx={{ fontWeight: 'bold' }}
              />
            </Stack>
          </Box>
          
          <OrderStatusTracker 
            status={order.status} 
            orderId={order.id}
            isEditable={isEditable}
            onStatusUpdate={handleStatusUpdate}
          />
        </CardContent>
      </Card>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Order Items
              </Typography>
              
              <List disablePadding>
                {order.productItems.map((item) => (
                  <ListItem key={item.productId} sx={{ py: 2, px: 0 }}>
                    <Avatar 
                      variant="rounded" 
                      src={item.image}
                      alt={item.name}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          {item.name || `Product #${item.productId}`}
                        </Typography>
                      }
                      secondary={`Quantity: ${item.quantity} × $${item.price.toFixed(2)}`}
                    />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
                <Divider />
                <ListItem sx={{ py: 2, px: 0 }}>
                  <ListItemText primary={<Typography variant="subtitle1">Subtotal</Typography>} />
                  <Typography variant="subtitle1">
                    ${orderTotal.toFixed(2)}
                  </Typography>
                </ListItem>
                <ListItem sx={{ py: 1, px: 0 }}>
                  <ListItemText primary={<Typography variant="subtitle1">Shipping</Typography>} />
                  <Typography variant="subtitle1">
                    $0.00
                  </Typography>
                </ListItem>
                <Divider />
                <ListItem sx={{ py: 2, px: 0 }}>
                  <ListItemText 
                    primary={
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Total
                      </Typography>
                    } 
                  />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    ${orderTotal.toFixed(2)}
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {userRole === 'consumer' ? 'Farmer Information' : 'Customer Information'}
                </Typography>
                
                <Box display="flex" alignItems="flex-start" mb={2}>
                  <Avatar
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      mr: 2, 
                      bgcolor: userRole === 'consumer' ? 'success.main' : 'primary.main' 
                    }}
                  >
                    {userRole === 'consumer' 
                      ? order.farmerName?.charAt(0) || 'F'
                      : order.consumerName?.charAt(0) || 'C'
                    }
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      {userRole === 'consumer' ? order.farmerName : order.consumerName}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={0.5}>
                      <EmailIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="textSecondary">
                        {userRole === 'consumer' ? 'farm@example.com' : order.consumerEmail}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mt={0.5}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="textSecondary">
                        {userRole === 'consumer' ? order.farmLocation : order.deliveryAddress}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Delivery Details
                </Typography>
                
                <Box display="flex" alignItems="flex-start" mb={2}>
                  <LocalShippingIcon fontSize="medium" sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      Shipping Address
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {order.deliveryAddress}
                    </Typography>
                    
                    {order.deliveryNotes && (
                      <Box mt={2}>
                        <Box display="flex" alignItems="center">
                          <NoteIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="subtitle2">
                            Delivery Notes
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                          {order.deliveryNotes}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
            
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Payment Information
                </Typography>
                
                <Box display="flex" alignItems="flex-start">
                  <PaymentIcon fontSize="medium" sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      {order.paymentMethod}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={0.5}>
                      <Chip 
                        label={order.paymentStatus} 
                        color={
                          order.paymentStatus === 'Paid' ? 'success' : 
                          order.paymentStatus === 'Refunded' ? 'error' : 
                          'warning'
                        }
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetails;
