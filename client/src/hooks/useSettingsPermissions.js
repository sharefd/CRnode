import { useEffect, useState } from 'react';
import { fetchPurposes } from '@/services/purposes';
import { useQuery } from 'react-query';

const useSettingsPermissions = passedUser => {
  const [user, setUser] = useState(passedUser);

  useEffect(() => {
    if (!passedUser) {
      const localUser = localStorage.getItem('CloudRoundsUser');
      setUser(JSON.parse(localUser));
    }
  }, [passedUser]);

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
    if (!isLoading && user) {
      const canWrite = data?.filter(purpose => purpose.canWriteMembers.map(u => u._id).includes(user?._id.toString()));
      setCanWritePurposes(canWrite);

      const canRead = data?.filter(purpose => purpose.canReadMembers.map(u => u._id).includes(user?._id));
      setCanReadPurposes(canRead);
    }
  }, [isLoading, user]);

  return {
    purposes: data,
    canWritePurposes,
    setCanWritePurposes,
    canReadPurposes,
    isLoading,
    refetchPurposes,
    isError,
    error
  };
};

export default useSettingsPermissions;
