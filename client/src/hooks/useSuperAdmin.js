import { useQuery } from 'react-query';
import { fetchCurrentUser } from '@/services/users';

const useSuperAdmin = () => {
  const localUser = localStorage.getItem('CloudRoundsUser');
  const userFromLocalStorage = localUser ? JSON.parse(localUser) : null;

  const superAdminIds = ['652afc81943693052e4910c0', '652afe1b58a9a2f617ea7206'];

  const {
    data: fetchedUser,
    isLoading,
    isError
  } = useQuery('userData', fetchCurrentUser, {
    enabled: !userFromLocalStorage
  });

  const isSuperAdmin = superAdminIds.includes(userFromLocalStorage?._id) || superAdminIds.includes(fetchedUser?._id);

  return { isSuperAdmin, isLoading, isError };
};

export default useSuperAdmin;
