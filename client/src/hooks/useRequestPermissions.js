import { useEffect, useState } from 'react';
import { fetchPurposes } from '@/services/purposes';
import { useQuery } from 'react-query';
import { fetchRequests } from '@/services/requests';

const useRequestPermissions = () => {
  const [canWritePurposes, setCanWritePurposes] = useState(null);
  const [canReadPurposes, setCanReadPurposes] = useState([]);
  const [allowedRequests, setAllowedRequests] = useState([]);

  const localUser = localStorage.getItem('CloudRoundsUser');
  const userId = JSON.parse(localUser)._id;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchPurposes
  } = useQuery(['userPurposes', userId], () => fetchPurposes(userId));

  const {
    data: requests,
    isLoading: isRequestsLoading,
    refetch
  } = useQuery('requests', fetchRequests, {
    enabled: !isLoading
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const filterData = async () => {
      const canWrite = data?.filter(purpose => purpose.canWriteMembers.includes(userId.toString())) || [];
      setCanWritePurposes(canWrite);

      const canRead = data?.filter(purpose => purpose.canReadMembers.includes(userId.toString())) || [];
      setCanReadPurposes(canRead);
    };

    if (userId) {
      filterData();
    }
  }, [isLoading]);

  useEffect(() => {
    if (isRequestsLoading || !canWritePurposes) {
      return;
    }

    const allowedPurposes = canWritePurposes.map(p => p.name);
    const canWriteRequests = requests ? requests.filter(request => allowedPurposes.includes(request.purpose)) : [];

    setAllowedRequests(canWriteRequests);
  }, [isRequestsLoading, canWritePurposes]);

  return {
    purposes: data,
    requests,
    canWritePurposes,
    canReadPurposes,
    allowedRequests,
    isLoading: isRequestsLoading || isLoading,
    refetch,
    refetchPurposes,
    isError,
    error
  };
};

export default useRequestPermissions;
