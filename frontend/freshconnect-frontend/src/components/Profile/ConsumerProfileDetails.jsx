import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper,
  Button
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  CreditCard as CreditCardIcon,
  LocationOn as LocationIcon,
  Restaurant as RestaurantIcon,
  Add as AddIcon
} from '@mui/icons-material';

/**
 * Component to display consumer-specific profile details
 */
const ConsumerProfileDetails = ({ userProfile }) => {
  // Extract consumer-specific details
  const foodPreferences = userProfile.foodPreferences || {};
  const paymentMethods = userProfile.paymentMethods || [];
  
  return (
    <>
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <RestaurantIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5">Food Preferences</Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          {foodPreferences && Object.keys(foodPreferences).length > 0 ? (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Dietary Restrictions
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                {foodPreferences.restrictions ? (
                  foodPreferences.restrictions.map((restriction, index) => (
                    <Chip 
                      key={index}
                      label={restriction}
                      color="primary"
                      variant="outlined"
                      sx={{ m: 0.5 }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No dietary restrictions specified.
                  </Typography>
                )}
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>
                Favorite Products
              </Typography>
              
              <Box>
                {foodPreferences.favorites ? (
                  foodPreferences.favorites.map((favorite, index) => (
                    <Chip 
                      key={index}
                      label={favorite}
                      color="primary"
                      sx={{ m: 0.5 }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No favorite products specified.
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Typography variant="body1">
              No food preferences specified yet. You can add your preferences in the Edit Profile section.
            </Typography>
          )}
        </CardContent>
      </Card>
      
      <Card elevation={3} sx={{ mt: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CreditCardIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5">Payment Methods</Typography>
            </Box>
            
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<AddIcon />}
            >
              Add New
            </Button>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          {paymentMethods && paymentMethods.length > 0 ? (
            <List>
              {paymentMethods.map((payment, index) => (
                <ListItem key={index} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 2 }}>
                  <ListItemIcon>
                    <CreditCardIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${payment.type} •••• ${payment.lastFour}`}
                    secondary={`Expires: ${payment.expiryMonth}/${payment.expiryYear}`}
                  />
                  {payment.isDefault && (
                    <Chip label="Default" size="small" color="primary" />
                  )}
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1">
              No payment methods added yet. You can add payment methods in the Edit Profile section.
            </Typography>
          )}
        </CardContent>
      </Card>
      
      <Card elevation={3} sx={{ mt: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h5">Delivery Addresses</Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          {userProfile.addresses && userProfile.addresses.length > 0 ? (
            <List>
              {userProfile.addresses.map((address, index) => (
                <ListItem key={index} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 2 }}>
                  <ListItemIcon>
                    <LocationIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={address.name}
                    secondary={`${address.street}, ${address.city}, ${address.province} ${address.postalCode}`}
                  />
                  {address.isDefault && (
                    <Chip label="Default" size="small" color="primary" />
                  )}
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1">
              No delivery addresses added yet. You can add addresses in the Edit Profile section.
            </Typography>
          )}
        </CardContent>
      </Card>
      
      <Paper elevation={3} sx={{ p: 3, mt: 3, bgcolor: 'primary.light', color: 'white' }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
          Recommended For You
        </Typography>
        <Typography variant="body1" sx={{ color: 'white' }}>
          Check out products based on your preferences in the marketplace!
        </Typography>
      </Paper>
    </>
  );
};

export default ConsumerProfileDetails;
