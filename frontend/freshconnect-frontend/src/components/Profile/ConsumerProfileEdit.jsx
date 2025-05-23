import React, { useState } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Button,
  Divider,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CreditCard as CreditCardIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

/**
 * Component for editing consumer-specific profile information
 */
const ConsumerProfileEdit = ({ 
  formData, 
  onChange, 
  onNestedChange, 
  onArrayChange, 
  onAddArrayItem, 
  onRemoveArrayItem, 
  section 
}) => {
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newPayment, setNewPayment] = useState({
    type: 'Credit Card',
    cardNumber: '',
    lastFour: '',
    expiryMonth: '',
    expiryYear: '',
    isDefault: false
  });
  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    isDefault: false
  });

  // Handle dietary restrictions input (comma-separated)
  const handleRestrictionsChange = (event) => {
    const restrictions = event.target.value
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    onNestedChange('foodPreferences', 'restrictions', restrictions);
  };

  // Handle favorite products input (comma-separated)
  const handleFavoritesChange = (event) => {
    const favorites = event.target.value
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    onNestedChange('foodPreferences', 'favorites', favorites);
  };

  // Format comma-separated strings for input fields
  const formatRestrictions = () => {
    return formData.foodPreferences?.restrictions?.join(', ') || '';
  };
  
  const formatFavorites = () => {
    return formData.foodPreferences?.favorites?.join(', ') || '';
  };

  // Handle new payment method input change
  const handleNewPaymentChange = (e) => {
    const { name, value, checked } = e.target;
    setNewPayment({
      ...newPayment,
      [name]: name === 'isDefault' ? checked : value
    });
    
    // Set last four digits if card number is entered
    if (name === 'cardNumber' && value.length >= 4) {
      setNewPayment({
        ...newPayment,
        cardNumber: value,
        lastFour: value.slice(-4)
      });
    }
  };

  // Handle new address input change
  const handleNewAddressChange = (e) => {
    const { name, value, checked } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: name === 'isDefault' ? checked : value
    });
  };

  // Add new payment method
  const handleAddPayment = () => {
    onAddArrayItem('paymentMethods', newPayment);
    setNewPayment({
      type: 'Credit Card',
      cardNumber: '',
      lastFour: '',
      expiryMonth: '',
      expiryYear: '',
      isDefault: false
    });
    setShowAddPayment(false);
  };

  // Add new address
  const handleAddAddress = () => {
    onAddArrayItem('addresses', newAddress);
    setNewAddress({
      name: '',
      street: '',
      city: '',
      province: '',
      postalCode: '',
      isDefault: false
    });
    setShowAddAddress(false);
  };

  // Render personal information fields
  if (section === 'personal') {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone || ''}
            onChange={onChange}
          />
        </Grid>
      </Grid>
    );
  }

  // Render preferences & payment fields
  if (section === 'preferences') {
    return (
      <Grid container spacing={3}>
        {/* Food Preferences Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Food Preferences
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Dietary Restrictions
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Enter your dietary restrictions (comma-separated)
                </Typography>
                
                <TextField
                  fullWidth
                  placeholder="e.g., Gluten-free, Vegan, Dairy-free"
                  value={formatRestrictions()}
                  onChange={handleRestrictionsChange}
                  helperText="Press Enter or add commas between items"
                />
                
                {formData.foodPreferences?.restrictions && formData.foodPreferences.restrictions.length > 0 && (
                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {formData.foodPreferences.restrictions.map((restriction, index) => (
                      <Chip
                        key={index}
                        label={restriction}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Favorite Products
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Enter your favorite products (comma-separated)
                </Typography>
                
                <TextField
                  fullWidth
                  placeholder="e.g., Tomatoes, Honey, Fresh Eggs"
                  value={formatFavorites()}
                  onChange={handleFavoritesChange}
                  helperText="Press Enter or add commas between items"
                />
                
                {formData.foodPreferences?.favorites && formData.foodPreferences.favorites.length > 0 && (
                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {formData.foodPreferences.favorites.map((favorite, index) => (
                      <Chip
                        key={index}
                        label={favorite}
                        color="primary"
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>
        
        {/* Payment Methods Section */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Payment Methods
            </Typography>
            
            <Button 
              variant="outlined" 
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setShowAddPayment(true)}
              disabled={showAddPayment}
            >
              Add Payment Method
            </Button>
          </Box>
          
          {/* Existing Payment Methods */}
          {formData.paymentMethods && formData.paymentMethods.length > 0 ? (
            formData.paymentMethods.map((payment, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CreditCardIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="subtitle1">
                          {payment.type} •••• {payment.lastFour}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Expires: {payment.expiryMonth}/{payment.expiryYear}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <IconButton color="error" onClick={() => onRemoveArrayItem('paymentMethods', index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={payment.isDefault} 
                        onChange={(e) => onArrayChange('paymentMethods', index, 'isDefault', e.target.checked)}
                      />
                    }
                    label="Default payment method"
                  />
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No payment methods added yet.
            </Typography>
          )}
          
          {/* Add New Payment Form */}
          {showAddPayment && (
            <Card variant="outlined" sx={{ mb: 2, p: 2, bgcolor: 'background.light' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Add Payment Method
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="payment-type-label">Type</InputLabel>
                      <Select
                        labelId="payment-type-label"
                        id="type"
                        name="type"
                        value={newPayment.type}
                        label="Type"
                        onChange={handleNewPaymentChange}
                      >
                        <MenuItem value="Credit Card">Credit Card</MenuItem>
                        <MenuItem value="Debit Card">Debit Card</MenuItem>
                        <MenuItem value="PayPal">PayPal</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      name="cardNumber"
                      value={newPayment.cardNumber}
                      onChange={handleNewPaymentChange}
                      helperText="For demo purposes only, not storing actual card numbers"
                    />
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth
                      label="Expiry Month"
                      name="expiryMonth"
                      placeholder="MM"
                      value={newPayment.expiryMonth}
                      onChange={handleNewPaymentChange}
                    />
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth
                      label="Expiry Year"
                      name="expiryYear"
                      placeholder="YY"
                      value={newPayment.expiryYear}
                      onChange={handleNewPaymentChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={newPayment.isDefault} 
                          onChange={handleNewPaymentChange}
                          name="isDefault"
                        />
                      }
                      label="Set as default payment method"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button 
                        variant="outlined" 
                        color="secondary"
                        onClick={() => setShowAddPayment(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={handleAddPayment}
                        disabled={!newPayment.cardNumber || !newPayment.expiryMonth || !newPayment.expiryYear}
                      >
                        Add Payment Method
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
          
          <Divider sx={{ my: 2 }} />
        </Grid>
        
        {/* Delivery Addresses Section */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Delivery Addresses
            </Typography>
            
            <Button 
              variant="outlined" 
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setShowAddAddress(true)}
              disabled={showAddAddress}
            >
              Add Address
            </Button>
          </Box>
          
          {/* Existing Addresses */}
          {formData.addresses && formData.addresses.length > 0 ? (
            formData.addresses.map((address, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="subtitle1">
                          {address.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {address.street}, {address.city}, {address.province} {address.postalCode}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <IconButton color="error" onClick={() => onRemoveArrayItem('addresses', index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={address.isDefault} 
                        onChange={(e) => onArrayChange('addresses', index, 'isDefault', e.target.checked)}
                      />
                    }
                    label="Default address"
                  />
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No delivery addresses added yet.
            </Typography>
          )}
          
          {/* Add New Address Form */}
          {showAddAddress && (
            <Card variant="outlined" sx={{ mb: 2, p: 2, bgcolor: 'background.light' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Add Delivery Address
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address Name"
                      name="name"
                      placeholder="e.g., Home, Work, etc."
                      value={newAddress.name}
                      onChange={handleNewAddressChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      name="street"
                      value={newAddress.street}
                      onChange={handleNewAddressChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      value={newAddress.city}
                      onChange={handleNewAddressChange}
                    />
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth
                      label="Province"
                      name="province"
                      value={newAddress.province}
                      onChange={handleNewAddressChange}
                    />
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth
                      label="Postal Code"
                      name="postalCode"
                      value={newAddress.postalCode}
                      onChange={handleNewAddressChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={newAddress.isDefault} 
                          onChange={handleNewAddressChange}
                          name="isDefault"
                        />
                      }
                      label="Set as default address"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button 
                        variant="outlined" 
                        color="secondary"
                        onClick={() => setShowAddAddress(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={handleAddAddress}
                        disabled={!newAddress.street || !newAddress.city || !newAddress.province || !newAddress.postalCode}
                      >
                        Add Address
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    );
  }

  return null;
};

export default ConsumerProfileEdit;
