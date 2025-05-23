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
      const response = await fetch('/api/users/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
      
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
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(profileData)
      });
      
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
      const response = await fetch('/api/users/me/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(passwordData)
      });
      
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

  /**
   * Get auth token from local storage
   * @returns {string} Auth token
   * @private
   */
  getToken() {
    // In a real app, this would get the token from localStorage or a state management solution
    return localStorage.getItem('token') || '';
  }
}

export default new ProfileService();
