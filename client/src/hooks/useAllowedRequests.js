import { useEffect, useState } from 'react';
import userStore from '@/stores/userStore';
import { fetchCanWritePermissions, fetchUserPermissions } from '../services/permissions';
import { useQuery } from 'react-query';
import { fetchRequests } from '@/services/requests';

export const useAllowedRequests = () => {
  const [allowedRequests, setAllowedRequests] = useState([]);
  const user = userStore.user;
  const [isLoading, setIsLoading] = useState(false);

  const { data: requests, isLoading: isRequestsLoading, refetch } = useQuery('requests', fetchRequests);

  const {
    data: permissions,
    isLoading: isPermissionsLoading,
    isError
  } = useQuery(['permissions', user?._id], () => fetchUserPermissions(user._id), {
    enabled: !!user,
    onSuccess: data => {
      userStore.setPermissions(data);
    }
  });

  useEffect(() => {
    if (isPermissionsLoading || isRequestsLoading) {
      return;
    }
    setIsLoading(true);

    const canWritePerms = fetchCanWritePermissions(permissions);

    const allowedFilteredRequests = requests ? requests.filter(request => canWritePerms.includes(request.purpose)) : [];

    setAllowedRequests(allowedFilteredRequests);
    setIsLoading(false);
  }, [requests, permissions]);

  return { allowedRequests, permissions, isLoading, refetch };
};
