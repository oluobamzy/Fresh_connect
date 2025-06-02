/**
 * Service for handling authentication-related API calls
 */
class AuthService {
  /**
   * Login with email and password
   * @param {string} email User's email
   * @param {string} password User's password
   * @returns {Promise<Object>} Authentication data including token and user info
   */
  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Handle non-OK responses
      if (!response.ok) {
        let errorMessage = `Login failed: ${response.status} ${response.statusText}`;
        try {
          // Try to parse the error response as JSON
          const errorText = await response.text();
          if (errorText) {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
          }
        } catch (parseError) {
          // If parsing fails, use the status text
          console.error('Failed to parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      // Handle the successful response
      try {
        const responseText = await response.text();
        if (!responseText) {
          throw new Error('Server returned an empty response');
        }
        
        const data = JSON.parse(responseText);
        // Store the token in localStorage
        localStorage.setItem('authToken', data.token);
        return data;
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('AuthService.login error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {Object} userData User registration data
   * @returns {Promise<Object>} Registration response
   */
  async register(userData) {
    try {
      console.log('Registering user with data:', JSON.stringify(userData));
      
      // Make sure we're sending properly formatted data
      const processedData = { ...userData };
      
      // Ensure JSONB fields are properly formatted
      if (typeof processedData.foodPreferences === 'string' && processedData.foodPreferences.trim() !== '') {
        try {
          // If it's already a JSON string, leave it as is; if not, create a simple JSON object
          JSON.parse(processedData.foodPreferences);
        } catch (e) {
          processedData.foodPreferences = JSON.stringify({ preferences: processedData.foodPreferences.split(',').map(p => p.trim()) });
        }
      }
      
      if (typeof processedData.farmDetails === 'string' && processedData.farmDetails.trim() !== '') {
        try {
          JSON.parse(processedData.farmDetails);
        } catch (e) {
          processedData.farmDetails = JSON.stringify({ description: processedData.farmDetails });
        }
      }
      
      if (typeof processedData.paymentMethods === 'string' && processedData.paymentMethods.trim() !== '') {
        try {
          JSON.parse(processedData.paymentMethods);
        } catch (e) {
          processedData.paymentMethods = JSON.stringify({ methods: processedData.paymentMethods.split(',').map(m => m.trim()) });
        }
      }
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });

      // Check if the response can be parsed as JSON
      let data;
      const contentType = response.headers.get('content-type');
      
      try {
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          console.error('Non-JSON response:', text);
          throw new Error('Server returned non-JSON response: ' + (text || 'Empty response'));
        }
      } catch (jsonError) {
        console.error('Failed to parse response:', jsonError);
        throw new Error('Failed to parse server response: ' + jsonError.message);
      }
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('AuthService.register error:', error);
      throw error;
    }
  }

  /**
   * Logout user by clearing stored auth data
   */
  logout() {
    localStorage.removeItem('authToken');
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Whether the user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Get the authentication token
   * @returns {string|null} The authentication token or null if not authenticated
   */
  getToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Get the current user from token
   * @returns {Object|null} The user data or null if not authenticated
   */
  getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      // Decode JWT token to get user info (simple implementation)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }
}

export default new AuthService();
