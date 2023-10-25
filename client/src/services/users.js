import axios from 'axios';
import userStore from '@/stores/userStore';

const isDevelopment = process.env.NODE_ENV === 'development';
const baseUrl = isDevelopment ? 'http://localhost:3001' : '';

export const updateUser = async editedUser => {
  try {
    const response = await axios.put(`${baseUrl}/api/users/${editedUser._id}`, editedUser);
    const updatedUser = response.data;
    userStore.setUsers(userStore.users.map(user => (user._id === updatedUser._id ? updatedUser : user)));
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

export const createUser = async user => {
  try {
    const response = await axios.post(`${baseUrl}/api/users/new`, user);
    console.log('user created:', response.data);
    return response.data;
  } catch (error) {
    console.error('There was an error creating the user:', error);
  }
};

export const deleteUser = async userId => {
  try {
    await axios.delete(`${baseUrl}/api/users/${userId}`);
    userStore.setUsers(userStore.users.filter(user => user._id !== userId));
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/users`);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
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
    console.error('Error updating user:', error);
  }
};
