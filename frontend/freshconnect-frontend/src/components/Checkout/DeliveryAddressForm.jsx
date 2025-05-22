import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem
} from '@mui/material';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 
  'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 
  'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const DeliveryAddressForm = ({ addressData, onChange }) => {
  const [formData, setFormData] = useState(addressData);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Basic validation
    validateField(name, value);
  };
  
  const validateField = (name, value) => {
    let errorMessages = { ...errors };
    
    switch (name) {
      case 'fullName':
        errorMessages.fullName = value ? '' : 'Full name is required';
        break;
      case 'addressLine1':
        errorMessages.addressLine1 = value ? '' : 'Address is required';
        break;
      case 'city':
        errorMessages.city = value ? '' : 'City is required';
        break;
      case 'state':
        errorMessages.state = value ? '' : 'State is required';
        break;
      case 'zipCode':
        errorMessages.zipCode = /^\d{5}(-\d{4})?$/.test(value) ? '' : 'Enter a valid ZIP code';
        break;
      case 'phoneNumber':
        errorMessages.phoneNumber = /^\d{10}$/.test(value.replace(/\D/g, '')) ? '' : 'Enter a valid 10-digit phone number';
        break;
      default:
        break;
    }
    
    setErrors(errorMessages);
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Delivery Address
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="fullName"
            name="fullName"
            label="Full Name"
            fullWidth
            variant="outlined"
            value={formData.fullName}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
            data-testid="fullName-input"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            id="addressLine1"
            name="addressLine1"
            label="Address Line 1"
            fullWidth
            variant="outlined"
            value={formData.addressLine1}
            onChange={handleChange}
            error={!!errors.addressLine1}
            helperText={errors.addressLine1}
            data-testid="addressLine1-input"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            id="addressLine2"
            name="addressLine2"
            label="Address Line 2 (Optional)"
            fullWidth
            variant="outlined"
            value={formData.addressLine2}
            onChange={handleChange}
            data-testid="addressLine2-input"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            variant="outlined"
            value={formData.city}
            onChange={handleChange}
            error={!!errors.city}
            helperText={errors.city}
            data-testid="city-input"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required variant="outlined">
            <InputLabel id="state-label">State</InputLabel>
            <Select
              labelId="state-label"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              label="State"
              error={!!errors.state}
              data-testid="state-select"
            >
              {US_STATES.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zipCode"
            name="zipCode"
            label="ZIP Code"
            fullWidth
            variant="outlined"
            value={formData.zipCode}
            onChange={handleChange}
            error={!!errors.zipCode}
            helperText={errors.zipCode}
            data-testid="zipCode-input"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number"
            fullWidth
            variant="outlined"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            placeholder="(xxx) xxx-xxxx"
            data-testid="phoneNumber-input"
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            id="deliveryInstructions"
            name="deliveryInstructions"
            label="Delivery Instructions (Optional)"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.deliveryInstructions}
            onChange={handleChange}
            data-testid="deliveryInstructions-input"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeliveryAddressForm;
