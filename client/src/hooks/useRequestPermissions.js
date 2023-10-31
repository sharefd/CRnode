import { useEffect, useState } from 'react';
import { fetchPurposes } from '@/services/purposes';
import { useQuery } from 'react-query';
import { fetchRequests } from '@/services/requests';

const useRequestPermissions = userId => {
  const [canWritePurposes, setCanWritePurposes] = useState([]);
  const [canReadPurposes, setCanReadPurposes] = useState([]);
  const [allowedRequests, setAllowedRequests] = useState([]);

  const queryKey = userId ? ['userPurposes', userId] : 'purposes';
  const fetchFunction = () => fetchPurposes(userId);

  const { data, isLoading, isError, error, refetch: refetchPurposes } = useQuery(queryKey, fetchFunction);

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
    if (isRequestsLoading || !canReadPurposes.length) {
      return;
    }

    const allowedPurposes = canReadPurposes.map(p => p.name);
    const canWriteRequests = requests ? requests.filter(request => allowedPurposes.includes(request.purpose)) : [];

    setAllowedRequests(canWriteRequests);
  }, [isRequestsLoading, canReadPurposes]);

  return {
    purposes: data,
    canWritePurposes,
    canReadPurposes,
    allowedRequests,
    isLoading,
    refetch,
    refetchPurposes,
    isError,
    error
  };
};

export default useRequestPermissions;
