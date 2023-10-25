import axios from 'axios';
import userStore from '@/stores/userStore';
import resourceStore from '@/stores/resourceStore';
import { PURPOSE_CHOICES } from '@/utils/constants';

const isDevelopment = process.env.NODE_ENV === 'development';
const baseUrl = isDevelopment ? 'http://localhost:3001' : '';

export const initPermissions = async userId => {
  try {
    const response = await axios.post(`${baseUrl}/api/permissions/init-permissions`, userId);
    return response.data;
  } catch (error) {
    console.error('Error updating permission:', error);
  }
};

export const savePermissions = async userPermissions => {
  try {
    const response = await axios.put(
      `${baseUrl}/api/permissions/bulk-update/${userPermissions.user._id}`,
      userPermissions.permissions
    );
    return response.data;
  } catch (error) {
    console.error('Error updating permission:', error);
  }
};

export const createPermission = async permission => {
  try {
    const response = await axios.post(`${baseUrl}/api/permissions/new`, permission);
    console.log('permission created:', response.data);
    return response.data;
  } catch (error) {
    console.error('There was an error creating the permission:', error);
  }
};

export const deletePermission = async permissionId => {
  try {
    await axios.delete(`${baseUrl}/api/permissions/${permissionId}`);
    userStore.setPermissions(userStore.permissions.filter(permission => permission._id !== permissionId));
  } catch (error) {
    console.error('Error deleting permission:', error);
  }
};

export const fetchPermissions = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/permissions`);
    return response.data;
  } catch (error) {
    console.error('Error updating permission:', error);
  }
};

export const fetchUserPermissions = async userId => {
  try {
    const response = await axios.get(`${baseUrl}/api/permissions/user/${userId}`);
    const permissions = response.data;
    userStore.setPermissions(permissions);
    return permissions;
  } catch (error) {
    console.error('Error updating permission:', error);
  }
};

export const fetchCanWritePermissions = permissions => {
  let allowed = [];

  Object.keys(PURPOSE_CHOICES).forEach(purpose => {
    const permission = permissions.find(p => p.purpose === purpose);
    if (permission.canWrite) {
      allowed.push(purpose);
    }
  });

  return allowed;
};

export const fetchCanReadPermissions = permissions => {
  let allowed = [];

  Object.keys(PURPOSE_CHOICES).forEach(purpose => {
    const permission = permissions.find(p => p.purpose === purpose);
    if (permission.canRead) {
      allowed.push(purpose);
    }
  });

  return allowed;
};
