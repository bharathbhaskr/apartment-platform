import apiCaller from '../utils/apiCaller'; // Adjust the path as needed

const AuthService = {
  login: async (credentials) => {
    try {
      const response = await apiCaller.post('/api/login', credentials);

      // Assuming the backend returns a token upon successful login
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        return { user, token };
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  register: async (userData) => {
    try {
      console.log("Before request")
      const response = await apiCaller.post('/api/register', userData);
      console.log("After  request", response.data)
      // Assuming the backend returns a token upon successful registration
      const {user} = response.data;
      const token = user.token;

      console.log("And the response", token)
      if (token) {
        localStorage.setItem('token', token);
        return { user, token };
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  //Admin Feature

  getTotalUsers: async () => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        throw new Error('Token not found');
      }
  
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      const response = await apiCaller.get('/api/admin/totalUsers', { headers });
      //console.log("Admin response", response.json);
      return response.data; // Adjust the response structure based on your API
    } catch (error) {
      console.error('Error fetching total users:', error);
      throw error;
    }
  },

  //Admin Feature

  getTotalHouseholds: async () => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        throw new Error('Token not found');
      }
  
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      const response = await apiCaller.get('/api/admin/totalHouseholds', { headers });
      return response.data; // Adjust the response structure based on your API
    } catch (error) {
      console.error('Error fetching total households:', error);
      throw error;
    }
  },

  //Admin Feature

  getHouseholdMembers: async (householdId) => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        throw new Error('Token not found');
      }
  
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      //use userController and decide if you want to send token or no
      const response = await apiCaller.get(`/api/admin/householdMembers/${householdId}`, { headers });
      console.log(response.data);
      return response.data.householdMembers; // Adjust the response structure based on your API
    } catch (error) {
      console.error('Error fetching household members:', error);
      throw error;
    }
  },

  //Admin Feature

  removeMemberFromHousehold: async (householdId, memberId) => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        throw new Error('Token not found');
      }
  
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      const response = await apiCaller.delete(`/api/admin/removeMember/${householdId}/${memberId}`, { headers });
      return response.data; // Adjust the response structure based on your API
    } catch (error) {
      console.error('Error removing member from household:', error);
      throw error;
    }
  },

  isAuthenticated: async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        return false; // Token is not present
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      console.log('Token info - ', token)
      const response = await apiCaller.get('/api/validateToken', { headers });

      if (response.status === 200) {
        return true; // Token is valid
      } else {
        return false; // Token is invalid or expired
      }
    } catch (error) {
      console.error(error);
      return false; // Request failed or other errors
    }
  },

  createOrJoinHousehold: async (action, inputValue) => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        throw new Error('Token not found');
      }
  
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
  
      const response = await apiCaller.post('/api/household', { action, inputValue }, { headers });
      console.log(headers)
      console.log((response.data))
      return response.data; // You may want to handle the response accordingly
    } catch (error) {
      console.error('Error creating or joining household:', error);
      throw error;
    }
  },

  validateEmail: (email) => {
    // Basic email validation using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  validateUsername: (username) => {
    // Check if the username has at least 3 alphabets or digits
    const usernameRegex = /^[a-zA-Z0-9]{3,}$/;
    return usernameRegex.test(username);
  },

  validatePassword: (password) => {
    // At least 8 characters, at least one uppercase letter, one lowercase letter, and one digit
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  },
  



};








export default AuthService;
