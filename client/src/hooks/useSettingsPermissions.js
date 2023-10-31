import { useEffect, useState } from 'react';
import { fetchPurposes } from '@/services/purposes';
import { useQuery } from 'react-query';
import { fetchCurrentUser } from '@/services/users';

const useSettingsPermissions = () => {
  const [canWritePurposes, setCanWritePurposes] = useState([]);
  const [canReadPurposes, setCanReadPurposes] = useState([]);

  const { data: user = {}, isLoading: userLoading } = useQuery('currentUser', fetchCurrentUser);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchPurposes
  } = useQuery(['userPurposes', user?._id], () => fetchPurposes(user?._id), {
    enabled: !userLoading && user !== undefined
  });

  useEffect(() => {
    if (isLoading || userLoading) {
      return;
    }

    const filterData = async () => {
      const canWrite = data?.filter(purpose => purpose.canWriteMembers.includes(user?._id.toString())) || [];
      setCanWritePurposes(canWrite);

      const canRead = data?.filter(purpose => purpose.canReadMembers.includes(user?._id.toString())) || [];
      setCanReadPurposes(canRead);
    };

    filterData();
  }, [isLoading, userLoading]);

  return {
    purposes: data,
    user,
    canWritePurposes,
    canReadPurposes,
    isLoading,
    userLoading,
    refetchPurposes,
    isError,
    error
  };
};

export default useSettingsPermissions;
