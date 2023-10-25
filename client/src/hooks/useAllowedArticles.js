import { useEffect, useState } from 'react';
import userStore from '@/stores/userStore';
import { fetchCanReadPermissions, fetchUserPermissions } from '../services/permissions';
import { useQuery } from 'react-query';
import { fetchArticles } from '@/services/articles';

export const useAllowedArticles = () => {
  const [allowedArticles, setAllowedArticles] = useState([]);
  const user = userStore.user;
  const [isLoading, setIsLoading] = useState(false);

  const { data: articles, isLoading: isArticlesLoading, refetch } = useQuery('articles', fetchArticles);

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
    if (isPermissionsLoading || isArticlesLoading) {
      return;
    }
    setIsLoading(true);

    const canReadPerms = fetchCanReadPermissions(permissions);

    const allowedFilteredArticles = articles ? articles.filter(article => canReadPerms.includes(article.purpose)) : [];

    setAllowedArticles(allowedFilteredArticles);
    setIsLoading(false);
  }, [articles, permissions]);

  return { allowedArticles, permissions, isLoading, refetch };
};
