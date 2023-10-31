import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';
const baseUrl = isDevelopment ? 'http://localhost:3001' : '';

export const fetchPurposes = async userId => {
  let response;
  try {
    if (userId) {
      response = await axios.get(`${baseUrl}/api/purposes/user/${userId.toString()}`);
    } else {
      response = await axios.get(`${baseUrl}/api/purposes`);
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching purposes:', error);
  }
};

export const bulkUpdatePurposes = async purposesToUpdate => {
  try {
    const response = await axios.put(
      `${baseUrl}/api/purposes/bulk-update/${purposesToUpdate.user._id}`,
      purposesToUpdate
    );
    return response.data;
  } catch (error) {
    console.error('Error bulk updating purposes:', error);
  }
};

export const fetchCanWritePurposes = purposes => {
  return purposes.filter(purpose => purpose.canWriteMembers.includes(userStore.user._id));
};

export const fetchCanReadPurposes = purposes => {
  return purposes.filter(purpose => purpose.canReadMembers.includes(userStore.user._id));
};

export const updatePurpose = async editedPurpose => {
  try {
    const response = await axios.put(`${baseUrl}/api/articles/${editedPurpose._id}`, editedPurpose);
    const updatedPurpose = response.data;
    userStore.setPurposes(
      userStore.purposes.map(purpose => (purpose._id === updatedPurpose._id ? updatedArticle : purpose))
    );
    return updatedPurpose;
  } catch (error) {
    console.error('Error updating purpose:', error);
  }
};

export const createPurpose = async (userId, purpose) => {
  try {
    const response = await axios.post(`${baseUrl}/api/purposes/new`, { userId, purpose });
    console.log('Purpose created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating purpose:', error);
  }
};

export const initPermissions = async (userId, purposes) => {
  try {
    const response = await axios.post(`${baseUrl}/api/purposes/init-permissions/${userId}`, { purposes });
    return response.data;
  } catch (error) {
    console.error('Error updating permission:', error);
  }
};
