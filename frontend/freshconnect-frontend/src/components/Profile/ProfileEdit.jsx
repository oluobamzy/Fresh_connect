import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Alert,
  Divider,
  Tab,
  Tabs
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import FarmerProfileEdit from './FarmerProfileEdit';
import ConsumerProfileEdit from './ConsumerProfileEdit';
import PasswordChangeForm from './PasswordChangeForm';

/**
 * Component for editing user profile information
 */
const ProfileEdit = ({ userProfile, onUpdate }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: userProfile.name || '',
    email: userProfile.email || '',
    // Role-specific data will be handled in child components
    farmDetails: userProfile.farmDetails || {},
    foodPreferences: userProfile.foodPreferences || {},
    paymentMethods: userProfile.paymentMethods || [],
    addresses: userProfile.addresses || []
  });
  const [submitStatus, setSubmitStatus] = useState({ 
    message: '', 
    severity: 'info',
    show: false 
  });
  const [loading, setLoading] = useState(false);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle nested object changes (for complex fields like farmDetails or foodPreferences)
  const handleNestedChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    });
  };

  // Handle array field changes (for fields like paymentMethods or addresses)
  const handleArrayChange = (field, index, key, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = {
      ...updatedArray[index],
      [key]: value
    };
    
    setFormData({
      ...formData,
      [field]: updatedArray
    });
  };

  // Add new item to array fields
  const handleAddArrayItem = (field, newItem) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], newItem]
    });
  };

  // Remove item from array fields
  const handleRemoveArrayItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await onUpdate(formData);
      
      if (result.success) {
        setSubmitStatus({
          message: result.message,
          severity: 'success',
          show: true
        });
        // Navigation will be handled by the parent component
      } else {
        setSubmitStatus({
          message: result.message,
          severity: 'error',
          show: true
        });
      }
    } catch (error) {
      setSubmitStatus({
        message: error.message || 'An unexpected error occurred.',
        severity: 'error',
        show: true
      });
    } finally {
      setLoading(false);
      window.scrollTo(0, 0); // Scroll to top to show status message
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {submitStatus.show && (
        <Alert 
          severity={submitStatus.severity} 
          sx={{ mb: 3 }}
          onClose={() => setSubmitStatus({...submitStatus, show: false})}
        >
          {submitStatus.message}
        </Alert>
      )}

      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="profile edit tabs"
            >
              <Tab label="Personal Information" value="personal" />
              {userProfile.role === 'farmer' && (
                <Tab label="Farm Details" value="farm" />
              )}
              {userProfile.role === 'consumer' && (
                <Tab label="Preferences & Payment" value="preferences" />
              )}
              <Tab label="Password" value="password" />
            </Tabs>
          </Box>

          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {/* Common fields for all users */}
              {userProfile.role === 'farmer' ? (
                <FarmerProfileEdit
                  formData={formData}
                  onChange={handleChange}
                  onNestedChange={handleNestedChange}
                  section="personal"
                />
              ) : (
                <ConsumerProfileEdit
                  formData={formData}
                  onChange={handleChange}
                  onNestedChange={handleNestedChange}
                  onArrayChange={handleArrayChange}
                  onAddArrayItem={handleAddArrayItem}
                  onRemoveArrayItem={handleRemoveArrayItem}
                  section="personal"
                />
              )}
            </Box>
          )}

          {/* Farm Details Tab (for farmers only) */}
          {activeTab === 'farm' && userProfile.role === 'farmer' && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Farm Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <FarmerProfileEdit
                formData={formData}
                onChange={handleChange}
                onNestedChange={handleNestedChange}
                section="farm"
              />
            </Box>
          )}

          {/* Preferences & Payment Tab (for consumers only) */}
          {activeTab === 'preferences' && userProfile.role === 'consumer' && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Preferences & Payment
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <ConsumerProfileEdit
                formData={formData}
                onChange={handleChange}
                onNestedChange={handleNestedChange}
                onArrayChange={handleArrayChange}
                onAddArrayItem={handleAddArrayItem}
                onRemoveArrayItem={handleRemoveArrayItem}
                section="preferences"
              />
            </Box>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <PasswordChangeForm />
            </Box>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={2} justifyContent="flex-end">
        <Grid item>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={loading || activeTab === 'password'}
          >
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileEdit;
