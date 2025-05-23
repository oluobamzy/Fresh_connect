import React from 'react';
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
  OutlinedInput
} from '@mui/material';

/**
 * Component for editing farmer-specific profile information
 */
const FarmerProfileEdit = ({ formData, onChange, onNestedChange, section }) => {
  const farmingMethods = [
    'Conventional',
    'Organic',
    'Hydroponic',
    'Permaculture',
    'Biodynamic',
    'Aquaponic',
    'Vertical Farming'
  ];

  const deliveryOptions = [
    'Farm Pickup',
    'Local Delivery',
    'Shipping',
    'Farmers Market'
  ];

  // Handle specialties input (comma-separated)
  const handleSpecialtiesChange = (event) => {
    const specialties = event.target.value
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    onNestedChange('farmDetails', 'specialties', specialties);
  };

  // Format specialties array to string for input field
  const formatSpecialties = () => {
    return formData.farmDetails?.specialties?.join(', ') || '';
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

  // Render farm details fields
  if (section === 'farm') {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Farm Name"
            name="farmName"
            value={formData.farmDetails?.name || ''}
            onChange={(e) => onNestedChange('farmDetails', 'name', e.target.value)}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Farm Location"
            name="farmLocation"
            value={formData.farmDetails?.location || ''}
            onChange={(e) => onNestedChange('farmDetails', 'location', e.target.value)}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel id="farming-method-label">Farming Method</InputLabel>
            <Select
              labelId="farming-method-label"
              id="farmingMethod"
              value={formData.farmDetails?.farmingMethod || ''}
              label="Farming Method"
              onChange={(e) => onNestedChange('farmDetails', 'farmingMethod', e.target.value)}
            >
              {farmingMethods.map((method) => (
                <MenuItem key={method} value={method}>
                  {method}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="delivery-options-label">Delivery Options</InputLabel>
            <Select
              labelId="delivery-options-label"
              id="deliveryOptions"
              value={formData.farmDetails?.deliveryOptions || ''}
              label="Delivery Options"
              onChange={(e) => onNestedChange('farmDetails', 'deliveryOptions', e.target.value)}
            >
              {deliveryOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Farm Description"
            name="farmDescription"
            multiline
            rows={4}
            value={formData.farmDetails?.description || ''}
            onChange={(e) => onNestedChange('farmDetails', 'description', e.target.value)}
            helperText="Describe your farm, its history, and your farming philosophy."
          />
        </Grid>
        
        <Grid item xs={12}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Farm Specialties
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Enter your farm's specialties (comma-separated)
            </Typography>
            
            <TextField
              fullWidth
              placeholder="e.g., Organic Vegetables, Heirloom Tomatoes, Free-range Eggs"
              value={formatSpecialties()}
              onChange={handleSpecialtiesChange}
              helperText="Press Enter or add commas between items"
            />
            
            {formData.farmDetails?.specialties && formData.farmDetails.specialties.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {formData.farmDetails.specialties.map((specialty, index) => (
                  <Chip
                    key={index}
                    label={specialty}
                    color="success"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    );
  }

  return null;
};

export default FarmerProfileEdit;
