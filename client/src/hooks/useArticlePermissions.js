import { useEffect, useState } from 'react';
import { fetchPurposes } from '@/services/purposes';
import { useQuery } from 'react-query';
import { fetchArticles } from '@/services/articles';

const useArticlePermissions = userId => {
  const [canWritePurposes, setCanWritePurposes] = useState([]);
  const [canReadPurposes, setCanReadPurposes] = useState([]);
  const [allowedArticles, setAllowedArticles] = useState([]);

  const queryKey = userId ? ['userPurposes', userId] : 'purposes';
  const fetchFunction = () => fetchPurposes(userId);

  const { data, isLoading, isError, error, refetch } = useQuery(queryKey, fetchFunction);

  const {
    data: articles,
    isLoading: isArticlesLoading,
    refetch: refetchArticles
  } = useQuery('articles', fetchArticles, {
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
    if (isArticlesLoading || !canReadPurposes.length) {
      return;
    }

    const allowedPurposes = canReadPurposes.map(p => p.name);
    const canReadArticles = articles ? articles.filter(article => allowedPurposes.includes(article.purpose)) : [];

    setAllowedArticles(canReadArticles);
  }, [isArticlesLoading, canReadPurposes]);

  return {
    purposes: data,
    canWritePurposes,
    canReadPurposes,
    allowedArticles,
    isLoading,
    refetch,
    refetchArticles,
    isError,
    error
  };
};

export default useArticlePermissions;
