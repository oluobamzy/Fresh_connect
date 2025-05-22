import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Paper, 
  Divider,
  Container,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import DeliveryAddressForm from './DeliveryAddressForm';
import PaymentMethodForm from './PaymentMethodForm';
import OrderSummary from './OrderSummary';

const steps = ['Delivery Address', 'Payment Method', 'Review Order'];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [orderData, setOrderData] = useState({
    deliveryAddress: {
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      phoneNumber: '',
      deliveryInstructions: ''
    },
    paymentMethod: {
      cardNumber: '',
      nameOnCard: '',
      expiryDate: '',
      cvv: ''
    }
  });

  // If cart is empty, redirect to marketplace
  React.useEffect(() => {
    if (items.length === 0) {
      navigate('/marketplace');
    }
  }, [items, navigate]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAddressFormChange = (addressData) => {
    setOrderData({
      ...orderData,
      deliveryAddress: addressData
    });
  };

  const handlePaymentFormChange = (paymentData) => {
    setOrderData({
      ...orderData,
      paymentMethod: paymentData
    });
  };

  const handlePlaceOrder = async () => {
    try {
      // Calculate total price
      const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      // Prepare order data
      const orderDetails = {
        items: items.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        deliveryAddress: orderData.deliveryAddress,
        paymentMethod: {
          type: 'credit_card',
          lastFour: orderData.paymentMethod.cardNumber.slice(-4)
        },
        totalAmount: total
      };

      // Call API to create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const data = await response.json();
      
      // Clear cart after successful order
      clearCart();
      
      // Navigate to order confirmation
      navigate(`/orders/confirmation/${data.orderId}`);
    } catch (error) {
      console.error('Error placing order:', error);
      // Handle error (show notification, etc.)
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <DeliveryAddressForm 
                 addressData={orderData.deliveryAddress} 
                 onChange={handleAddressFormChange} 
               />;
      case 1:
        return <PaymentMethodForm 
                 paymentData={orderData.paymentMethod} 
                 onChange={handlePaymentFormChange} 
               />;
      case 2:
        return <OrderSummary 
                 orderData={orderData} 
                 cartItems={items} 
               />;
      default:
        return 'Unknown step';
    }
  };

  // Form validation
  const isAddressFormValid = () => {
    const { fullName, addressLine1, city, state, zipCode, phoneNumber } = orderData.deliveryAddress;
    return fullName && addressLine1 && city && state && zipCode && phoneNumber;
  };

  const isPaymentFormValid = () => {
    const { cardNumber, nameOnCard, expiryDate, cvv } = orderData.paymentMethod;
    return cardNumber && nameOnCard && expiryDate && cvv;
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return isAddressFormValid();
      case 1:
        return isPaymentFormValid();
      case 2:
        return true;
      default:
        return false;
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, my: 3 }}>
        Checkout
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            <Box sx={{ mt: 2, mb: 2 }}>
              {getStepContent(activeStep)}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handlePlaceOrder}
                  data-testid="place-order-btn"
                >
                  Place Order
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={!isStepValid(activeStep)}
                >
                  Next
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: '20px' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Order Summary
            </Typography>
            
            {items.map((item) => (
              <Box key={item.product.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  {item.quantity} × {item.product.name}
                </Typography>
                <Typography variant="body2">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1">
                ${items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Shipping</Typography>
              <Typography variant="body1">$5.00</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Total</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                ${(items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) + 5).toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
