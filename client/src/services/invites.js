import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';
const BASE_URL = isDevelopment ? 'http://localhost:3003' : '';

export const createInvite = async inviteData => {
  try {
    const response = await axios.post(`${BASE_URL}/api/invites`, inviteData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const registerWithToken = async data => {
  try {
    const response = await axios.post(`${BASE_URL}/api/invites/register-with-token`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllInvites = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/invites`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getInviteByToken = async token => {
  try {
    const response = await axios.get(`${BASE_URL}/api/invites/${token}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteInviteByToken = async token => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/invites/${token}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
