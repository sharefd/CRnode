import { useEffect, useState } from 'react';
import { fetchPurposes } from '@/services/purposes';
import { useQuery } from 'react-query';

const useSettingsPermissions = user => {
  const [canWritePurposes, setCanWritePurposes] = useState([]);
  const [canReadPurposes, setCanReadPurposes] = useState([]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchPurposes
  } = useQuery(['userPurposes', user?._id], () => fetchPurposes(user?._id), {
    enabled: user !== undefined
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const filterData = async () => {
      const canWrite = data?.filter(purpose => purpose.canWriteMembers.includes(user?._id.toString())) || [];
      setCanWritePurposes(canWrite);

      const canRead = data?.filter(purpose => purpose.canReadMembers.includes(user?._id.toString())) || [];
      setCanReadPurposes(canRead);
    };

    filterData();
  }, [isLoading]);

  return {
    purposes: data,
    canWritePurposes,
    canReadPurposes,
    isLoading,
    refetchPurposes,
    isError,
    error
  };
};

export default useSettingsPermissions;
