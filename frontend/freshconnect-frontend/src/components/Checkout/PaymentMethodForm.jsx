import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Grid, 
  FormControl, 
  FormControlLabel, 
  Radio, 
  RadioGroup,
  InputAdornment
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SecurityIcon from '@mui/icons-material/Security';

const PaymentMethodForm = ({ paymentData, onChange }) => {
  const [formData, setFormData] = useState(paymentData);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    }
    
    // Format expiry date with slash
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\//g, '');
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
    }
    
    // Limit CVV to 3-4 digits
    if (name === 'cvv') {
      formattedValue = value.slice(0, 4);
    }
    
    setFormData({
      ...formData,
      [name]: formattedValue
    });
    
    // Basic validation
    validateField(name, formattedValue);
  };
  
  const validateField = (name, value) => {
    let errorMessages = { ...errors };
    
    switch (name) {
      case 'cardNumber':
        errorMessages.cardNumber = /^(\d{4}\s){3}\d{4}$/.test(value) ? '' : 'Enter a valid 16-digit card number';
        break;
      case 'nameOnCard':
        errorMessages.nameOnCard = value ? '' : 'Name on card is required';
        break;
      case 'expiryDate':
        const [month, year] = value.split('/');
        const currentYear = new Date().getFullYear() % 100; // Get last 2 digits of year
        const currentMonth = new Date().getMonth() + 1; // 1-12
        
        if (!/^\d{2}\/\d{2}$/.test(value)) {
          errorMessages.expiryDate = 'Enter a valid expiry date (MM/YY)';
        } else if (parseInt(month) < 1 || parseInt(month) > 12) {
          errorMessages.expiryDate = 'Month must be between 01-12';
        } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
          errorMessages.expiryDate = 'Card has expired';
        } else {
          errorMessages.expiryDate = '';
        }
        break;
      case 'cvv':
        errorMessages.cvv = /^\d{3,4}$/.test(value) ? '' : 'Enter a valid CVV (3-4 digits)';
        break;
      default:
        break;
    }
    
    setErrors(errorMessages);
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <RadioGroup 
          row 
          name="paymentType" 
          defaultValue="creditCard"
          data-testid="payment-type-radio"
        >
          <FormControlLabel 
            value="creditCard" 
            control={<Radio />} 
            label="Credit Card" 
            sx={{ mr: 4 }}
          />
          <FormControlLabel 
            value="paypal" 
            control={<Radio disabled />} 
            label="PayPal (Coming Soon)" 
          />
        </RadioGroup>
      </FormControl>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="cardNumber"
            name="cardNumber"
            label="Card Number"
            fullWidth
            variant="outlined"
            value={formData.cardNumber}
            onChange={handleChange}
            error={!!errors.cardNumber}
            helperText={errors.cardNumber}
            placeholder="1234 5678 9012 3456"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CreditCardIcon />
                </InputAdornment>
              ),
            }}
            inputProps={{ maxLength: 19 }}
            data-testid="cardNumber-input"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            id="nameOnCard"
            name="nameOnCard"
            label="Name on Card"
            fullWidth
            variant="outlined"
            value={formData.nameOnCard}
            onChange={handleChange}
            error={!!errors.nameOnCard}
            helperText={errors.nameOnCard}
            data-testid="nameOnCard-input"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="expiryDate"
            name="expiryDate"
            label="Expiry Date"
            fullWidth
            variant="outlined"
            value={formData.expiryDate}
            onChange={handleChange}
            error={!!errors.expiryDate}
            helperText={errors.expiryDate}
            placeholder="MM/YY"
            inputProps={{ maxLength: 5 }}
            data-testid="expiryDate-input"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="cvv"
            name="cvv"
            label="CVV"
            fullWidth
            variant="outlined"
            value={formData.cvv}
            onChange={handleChange}
            error={!!errors.cvv}
            helperText={errors.cvv}
            type="password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SecurityIcon />
                </InputAdornment>
              ),
            }}
            inputProps={{ maxLength: 4 }}
            data-testid="cvv-input"
          />
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="body2" color="textSecondary">
          <SecurityIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
          Your payment information is encrypted and processed securely. We do not store your complete card details.
        </Typography>
      </Box>
    </Box>
  );
};

export default PaymentMethodForm;
