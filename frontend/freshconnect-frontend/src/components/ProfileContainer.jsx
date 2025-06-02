import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Box, Tabs, Tab, Typography, Paper, Alert } from '@mui/material';
import ProfileDetails from './Profile/ProfileDetails';
import ProfileEdit from './Profile/ProfileEdit';
import Loader from './Loader';
import ProfileService from '../services/ProfileService';
import { useAuth } from './Auth/AuthContext';

/**
 * Container component for Profile Management
 * Handles routing between profile views and provides user data context
 */
const ProfileContainer = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated } = useAuth();

  // Fetch user profile data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    } else {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isAuthenticated]);

  // Fetch user profile from API
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await ProfileService.getProfile();
      setUserProfile(profileData);
    } catch (err) {
      console.error('Failed to load profile:', err);
      if (err.message === 'Not authenticated' || err.message === 'Authentication expired') {
        navigate('/login', { state: { from: location.pathname } });
      } else {
        setError('Failed to load profile data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    navigate(newValue === 'details' ? '/profile' : '/profile/edit');
  };

  // Handle profile update
  const handleProfileUpdate = async (updatedProfile) => {
    try {
      setLoading(true);
      const result = await ProfileService.updateProfile(updatedProfile);
      setUserProfile(result.user);
      navigate('/profile');
      return { success: true, message: 'Profile updated successfully.' };
    } catch (err) {
      console.error('Failed to update profile:', err);
      return { success: false, message: err.message || 'Failed to update profile. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Loader />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, mx: 'auto', maxWidth: 600 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Profile Management
      </Typography>
      
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="profile tabs"
          >
            <Tab label="Profile Details" value="details" />
            <Tab label="Edit Profile" value="edit" />
          </Tabs>
        </Box>
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {activeTab === 'details' 
              ? 'View your profile information and account details.' 
              : 'Update your profile information and preferences.'}
          </Typography>
        </Box>
      </Paper>

      {userProfile && (
        <Routes>
          <Route index element={<ProfileDetails userProfile={userProfile} />} />
          <Route path="edit" element={<ProfileEdit userProfile={userProfile} onUpdate={handleProfileUpdate} />} />
          <Route path="*" element={<Navigate to="/profile" replace />} />
        </Routes>
      )}
    </Box>
  );
};

export default ProfileContainer;
