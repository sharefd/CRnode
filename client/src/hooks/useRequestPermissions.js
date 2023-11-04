import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { fetchRequests } from '@/services/requests';

const useRequestPermissions = () => {
  const [canWritePurposes, setCanWritePurposes] = useState([]);
  const [canReadPurposes, setCanReadPurposes] = useState([]);
  const [allowedPurposes, setAllowedPurposes] = useState([]);
  const [allowedRequests, setAllowedRequests] = useState([]);

  const localUser = localStorage.getItem('CloudRoundsUser');
  const userId = JSON.parse(localUser)._id;

  const { data: requests, isLoading, refetch } = useQuery('requests', fetchRequests);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const canWriteRequests =
      requests?.filter(request => request.purpose && request.purpose.canWriteMembers.includes(userId)) || [];
    const canReadRequests =
      requests?.filter(request => request.purpose && request.purpose.canReadMembers.includes(userId)) || [];

    const uniqueCanWritePurposes = [...new Set(canWriteRequests.map(request => request.purpose))];
    const uniqueCanReadPurposes = [...new Set(canReadRequests.map(request => request.purpose))];
    const uniqueAllowedPurposes = [...new Set(canReadRequests.map(request => request.purpose.name))];

    setCanWritePurposes(uniqueCanWritePurposes);
    setCanReadPurposes(uniqueCanReadPurposes);
    setAllowedPurposes(uniqueAllowedPurposes);
    setAllowedRequests(canWriteRequests);
  }, [isLoading, requests]);

  return {
    requests,
    canWritePurposes,
    canReadPurposes,
    allowedPurposes,
    allowedRequests,
    isLoading,
    refetch
  };
};

export default useRequestPermissions;
