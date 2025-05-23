import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  EventNote as EventNoteIcon,
  Security as SecurityIcon,
  Edit as EditIcon,
  LocalShipping as ShippingIcon
} from '@mui/icons-material';
import FarmerProfileDetails from './FarmerProfileDetails';
import ConsumerProfileDetails from './ConsumerProfileDetails';

/**
 * Component to display user profile details
 */
const ProfileDetails = ({ userProfile }) => {
  const navigate = useNavigate();
  
  // Handle edit button click
  const handleEditClick = () => {
    navigate('/profile/edit');
  };

  // Handle order history click
  const handleOrdersClick = () => {
    navigate('/orders');
  };
  
  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: userProfile.role === 'farmer' ? 'success.main' : 'primary.main'
                }}
              >
                {userProfile.name.charAt(0).toUpperCase()}
              </Avatar>
              
              <Typography variant="h5" gutterBottom>
                {userProfile.name}
              </Typography>
              
              <Chip
                label={userProfile.role === 'farmer' ? 'Farmer' : 'Consumer'}
                color={userProfile.role === 'farmer' ? 'success' : 'primary'}
                sx={{ mb: 2 }}
              />
              
              {userProfile.role === 'farmer' && (
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={userProfile.isVerified ? 'Verified' : 'Pending Verification'}
                    color={userProfile.isVerified ? 'success' : 'warning'}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              )}
              
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEditClick}
                sx={{ mt: 3 }}
                fullWidth
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
          
          <Card elevation={3} sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Name" 
                    secondary={userProfile.name} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email" 
                    secondary={userProfile.email} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <EventNoteIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Member Since" 
                    secondary={new Date(userProfile.createdAt).toLocaleDateString()} 
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Account Status" 
                    secondary={userProfile.isActive ? 'Active' : 'Inactive'} 
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<ShippingIcon />}
                onClick={handleOrdersClick}
                fullWidth
              >
                Order History
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          {/* Render different content based on user role */}
          {userProfile.role === 'farmer' ? (
            <FarmerProfileDetails userProfile={userProfile} />
          ) : (
            <ConsumerProfileDetails userProfile={userProfile} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileDetails;
