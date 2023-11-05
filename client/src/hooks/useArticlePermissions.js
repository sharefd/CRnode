import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { fetchArticles } from '@/services/articles';

const useArticlePermissions = () => {
  const [allowedArticles, setAllowedArticles] = useState([]);
  const [allowedPurposes, setAllowedPurposes] = useState([]);
  const [canReadPurposes, setCanReadPurposes] = useState([]);
  const [canWritePurposes, setCanWritePurposes] = useState([]);

  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

  const { data: articles, isLoading, refetch: refetchArticles } = useQuery('articles', fetchArticles);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const canReadArticles = articles
      ? articles.filter(article => article.purpose && article.purpose.canReadMembers.includes(user._id.toString()))
      : [];

    const canWriteArticles = articles
      ? articles.filter(article => article.purpose && article.purpose.canWriteMembers.includes(user._id.toString()))
      : [];

    const uniquePurposeIds = new Set(canReadArticles.map(article => article.purpose?._id).filter(Boolean));

    if (canReadArticles.length > 0) {
      const uniqueCanReadPurposes = [...uniquePurposeIds]
        .map(id => canReadArticles.find(article => article.purpose && article.purpose._id === id)?.purpose)
        .filter(Boolean);

      setCanReadPurposes(uniqueCanReadPurposes);

      const uniqueAllowedPurposes = uniqueCanReadPurposes.map(purpose => purpose.name);
      setAllowedPurposes(uniqueAllowedPurposes);
    }

    if (canWriteArticles.length > 0) {
      const uniqueCanWritePurposes = [...uniquePurposeIds]
        .map(id => canWriteArticles.find(article => article.purpose && article.purpose._id === id)?.purpose)
        .filter(Boolean);

      setCanWritePurposes(uniqueCanWritePurposes);
    }

    setAllowedArticles(canReadArticles);
  }, [isLoading, articles]);

  return {
    allowedArticles,
    allowedPurposes,
    canReadPurposes,
    canWritePurposes,
    isLoading,
    refetchArticles
  };
};

export default useArticlePermissions;
