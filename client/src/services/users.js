import axios from 'axios';
import userStore from '@/stores/userStore';

const isDevelopment = process.env.NODE_ENV === 'development';
const baseUrl = isDevelopment ? 'http://localhost:3003' : '';

export const fetchCurrentUser = async () => {
  const token = localStorage.getItem('CloudRoundsToken');
  if (token) {
    try {
      const response = await axios.get(`${baseUrl}/api/users/me`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('CloudRoundsToken');
    }
  }
};

export const updateUser = async editedUser => {
  try {
    const response = await axios.put(`${baseUrl}/api/users/${editedUser._id}`, editedUser);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const response = await axios.put(`${baseUrl}/api/users/change-password`, {
      userId,
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

export const createUser = async credentials => {
  try {
    const response = await axios.post(`${baseUrl}/api/users/register`, credentials);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${baseUrl}/api/users/login`, { username, password });
    return response.data;
  } catch (error) {
    console.error('There was an error during log in:', error);
  }
};

export const deleteUser = async userId => {
  try {
    const response = await axios.delete(`${baseUrl}/api/users/${userId}`);
    userStore.setUsers(userStore.users.filter(user => user._id !== userId));
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

export const toggleAttending = async (userId, articleId, isAttending) => {
  try {
    const response = await axios.put(`${baseUrl}/api/users/toggle-attend`, {
      userId,
      articleId,
      isAttending
    });
    return response.data;
  } catch (error) {
    console.error('Error updating attending for user:', error);
  }
};

export const toggleFavorite = async (userId, articleId, isFavorite) => {
  try {
    const response = await axios.put(`${baseUrl}/api/users/toggle-favorite`, {
      userId,
      articleId,
      isFavorite
    });
    return response.data.favorites;
  } catch (error) {
    console.error('Error updating favorite for user:', error);
  }
};

export const getFavorites = async userId => {
  try {
    const response = await axios.get(`${baseUrl}/api/users/favorites/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting favorites for user:', error);
  }
};
