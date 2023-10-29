import { useEffect, useState } from 'react';
import userStore from '@/stores/userStore';
import { fetchUserPermissions } from '../services/permissions';
import { useQuery } from 'react-query';

const usePermissions = () => {
  const user = userStore.user;

  const {
    data: permissions,
    isLoading,
    isError
  } = useQuery(['permissions', user?._id], () => fetchUserPermissions(user._id), {
    enabled: !!user,
    onSuccess: data => {
      userStore.setPermissions(data);
    }
  });

  useEffect(() => {
    if (!isLoading) {
      return;
    } else if (isError) {
      console.error('Permissions loading error');
      return;
    }
  }, [isLoading]);

  return { permissions, isLoading };
};

export default usePermissions;
