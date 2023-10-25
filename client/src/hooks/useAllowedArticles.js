import { useEffect, useState } from 'react';
import userStore from '@/stores/userStore';
import { fetchCanReadPermissions, fetchPermissions } from '../services/permissions';
import { useQuery } from 'react-query';

export const useAllowedArticles = articles => {
  const [allowedArticles, setAllowedArticles] = useState([]);
  const user = userStore.user;

  const {
    data: permissions,
    isLoading: isPermissionsLoading,
    isError
  } = useQuery(['permissions', user?._id], () => fetchPermissions(user._id), {
    enabled: !!user,
    onSuccess: data => {
      userStore.setPermissions(data);
    }
  });

  useEffect(() => {
    if (isPermissionsLoading || isError || !permissions) {
      return;
    }

    const allowed = fetchCanReadPermissions(permissions);

    const allowedFilteredArticles = articles ? articles.filter(article => allowed.includes(article.purpose)) : [];
    setAllowedArticles(allowedFilteredArticles);
  }, [articles, permissions, isPermissionsLoading, isError]);

  return { allowedArticles, isLoading: isPermissionsLoading };
};
