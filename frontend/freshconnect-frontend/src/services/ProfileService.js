import AuthService from './AuthService';

/**
 * Service for handling user profile-related API calls
 */
class ProfileService {
  /**
   * Get the current user's profile
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        throw new Error('Authentication expired');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('ProfileService.getProfile error:', error);
      throw error;
    }
  }

  /**
   * Update the current user's profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} Updated user data
   */
  async updateProfile(profileData) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      if (response.status === 401) {
        throw new Error('Authentication expired');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('ProfileService.updateProfile error:', error);
      throw error;
    }
  }

  /**
   * Update user password
   * @param {Object} passwordData - Old and new password
   * @returns {Promise<Object>} Success message
   */
  async updatePassword(passwordData) {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/users/me/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
      });
      
      if (response.status === 401) {
        throw new Error('Authentication expired');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update password');
      }
      
      return await response.json();
    } catch (error) {
      console.error('ProfileService.updatePassword error:', error);
      throw error;
    }
  }
}

export default new ProfileService();
