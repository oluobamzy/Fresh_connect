import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper
} from '@mui/material';
import {
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Agriculture as AgricultureIcon,
  Nature as NatureIcon,
  LocalShipping as ShippingIcon
} from '@mui/icons-material';

/**
 * Component to display farmer-specific profile details
 */
const FarmerProfileDetails = ({ userProfile }) => {
  // Extract farm details from the user profile
  const farmDetails = userProfile.farmDetails || {};
  
  return (
    <>
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AgricultureIcon color="success" sx={{ mr: 1 }} />
            <Typography variant="h5">Farm Information</Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <List>
            <ListItem>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Farm Name" 
                secondary={farmDetails.name || 'Not specified'} 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <LocationIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Location" 
                secondary={farmDetails.location || 'Not specified'} 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <NatureIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Farming Method" 
                secondary={farmDetails.farmingMethod || 'Not specified'} 
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <ShippingIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Delivery Options" 
                secondary={farmDetails.deliveryOptions || 'Not specified'} 
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      
      <Card elevation={3} sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Farm Description
          </Typography>
          
          <Typography variant="body1" paragraph>
            {farmDetails.description || 'No farm description available.'}
          </Typography>
        </CardContent>
      </Card>
      
      <Card elevation={3} sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Products & Specialties
          </Typography>
          
          {farmDetails.specialties && farmDetails.specialties.length > 0 ? (
            <Box sx={{ mt: 2 }}>
              {farmDetails.specialties.map((specialty, index) => (
                <Chip 
                  key={index}
                  label={specialty}
                  color="success"
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No specialties listed.
            </Typography>
          )}
        </CardContent>
      </Card>
      
      <Paper elevation={3} sx={{ p: 3, mt: 3, bgcolor: 'success.light', color: 'white' }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
          Seller Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: 'white' }}>
          Your products and sales data are available in the marketplace section.
        </Typography>
      </Paper>
    </>
  );
};

export default FarmerProfileDetails;
