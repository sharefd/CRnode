import axios from 'axios';
import resourceStore from '@/stores/resourceStore';
import { compareDates } from '@/utils/dates';

const isDevelopment = process.env.NODE_ENV === 'development';
const baseUrl = isDevelopment ? 'http://localhost:3003' : '';

export const updateRequest = async request => {
  try {
    const response = await axios.put(`${baseUrl}/api/requests/${request._id}/status`, request);
    return response.data;
  } catch (error) {
    console.error('Error updating request:', error);
  }
};

export const createBulkRequests = async (userIds, purposeId) => {
  try {
    const response = await axios.post(`${baseUrl}/api/requests/bulk-new`, { purposeId, userIds });
    return response.data;
  } catch (error) {
    console.error('Error creating purposes:', error);
  }
};
export const createRequest = async request => {
  try {
    const response = await axios.post(`${baseUrl}/api/requests/new`, request);
    console.log('Request created:', response.data);
    return response.data;
  } catch (error) {
    console.error('There was an error creating the request:', error);
  }
};

export const deleteRequest = async requestId => {
  try {
    const response = await axios.delete(`${baseUrl}/api/requests/${requestId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting request:', error);
  }
};

export const sortRequests = requests => {
  return requests.sort((a, b) => {
    return compareDates(a, b);
  });
};

export const fetchRequests = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/requests`);
    const requests = response.data;
    resourceStore.setRequests(requests);
    return requests;
  } catch (error) {
    console.error('Error updating request:', error);
  }
};
