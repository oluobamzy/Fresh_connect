import React from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Grid, 
  Paper,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const OrderSummary = ({ orderData, cartItems }) => {
  const { deliveryAddress, paymentMethod } = orderData;
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = 5; // Fixed shipping cost
  const total = subtotal + shipping;
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Review
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Delivery Address
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1">{deliveryAddress.fullName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {deliveryAddress.addressLine1}
              {deliveryAddress.addressLine2 && `, ${deliveryAddress.addressLine2}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zipCode}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Phone: {deliveryAddress.phoneNumber}
            </Typography>
            {deliveryAddress.deliveryInstructions && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight={600}>
                  Delivery Instructions:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {deliveryAddress.deliveryInstructions}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CreditCardIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Payment Method
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1">Credit Card</Typography>
            <Typography variant="body2" color="text.secondary">
              Card ending in {paymentMethod.cardNumber.slice(-4)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {paymentMethod.nameOnCard}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Expires: {paymentMethod.expiryDate}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Order Items
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List disablePadding>
              {cartItems.map((item) => (
                <ListItem key={item.product.id} sx={{ py: 1, px: 0 }}>
                  <ListItemText
                    primary={item.product.name}
                    secondary={`Quantity: ${item.quantity}`}
                  />
                  <Typography variant="body2">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
              
              <Divider sx={{ my: 2 }} />
              
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Subtotal" />
                <Typography variant="body1">
                  ${subtotal.toFixed(2)}
                </Typography>
              </ListItem>
              
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Shipping" />
                <Typography variant="body1">
                  ${shipping.toFixed(2)}
                </Typography>
              </ListItem>
              
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary={<Typography variant="subtitle1" fontWeight={600}>Total</Typography>} />
                <Typography variant="subtitle1" fontWeight={600}>
                  ${total.toFixed(2)}
                </Typography>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4, p: 2, backgroundColor: '#f0f7ff', borderRadius: 1, border: '1px solid #cfe7ff' }}>
        <Typography variant="body2" color="primary">
          By placing this order, you agree to FreshConnect's terms and conditions and privacy policy. Your items will be delivered within 1-3 business days.
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderSummary;
