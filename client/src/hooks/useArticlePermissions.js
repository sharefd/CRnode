import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { fetchArticles } from '@/services/articles';
import { fetchPurposes } from '@/services/purposes';

const useArticlePermissions = () => {
  const [allowedArticles, setAllowedArticles] = useState([]);
  const [allowedPurposes, setAllowedPurposes] = useState([]);
  const [canReadPurposes, setCanReadPurposes] = useState([]);
  const [canWritePurposes, setCanWritePurposes] = useState([]);

  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

  const {
    data: articles,
    isLoading: isArticlesLoading,
    refetch: refetchArticles
  } = useQuery('articles', fetchArticles);

  const {
    data: purposes,
    isLoading: isPurposesLoading,
    refetch: refetchPurposes
  } = useQuery(['userPurposes', user?._id], () => fetchPurposes(user?._id), {
    enabled: !!user
  });

  useEffect(() => {
    if (isArticlesLoading || isPurposesLoading) {
      return;
    }

    const purposeIds = purposes.map(p => ({
      _id: p._id,
      canReadMembers: p.canReadMembers.map(m => m._id),
      canWriteMembers: p.canWriteMembers.map(m => m._id)
    }));

    const canReadArticles = articles
      ? articles.filter(
          article =>
            article.purpose &&
            purposeIds.some(p => p._id === article.purpose._id && p.canReadMembers.includes(user._id))
        )
      : [];

    const canWriteArticles = articles
      ? articles.filter(
          article =>
            article.purpose &&
            purposeIds.some(p => p._id === article.purpose._id && p.canWriteMembers.includes(user._id))
        )
      : [];

    setCanReadPurposes(
      purposes.filter(p => canReadArticles.some(article => article.purpose && article.purpose._id === p._id))
    );
    setCanWritePurposes(
      purposes.filter(p => canWriteArticles.some(article => article.purpose && article.purpose._id === p._id))
    );

    const purposeNames = purposes.map(p => p.name);
    setAllowedPurposes(purposeNames);
    setAllowedArticles(canReadArticles);
  }, [isArticlesLoading, isPurposesLoading]);

  return {
    allowedArticles,
    allowedPurposes,
    userPurposes: purposes,
    canReadPurposes,
    canWritePurposes,
    isLoading: isArticlesLoading || isPurposesLoading,
    refetchArticles,
    refetchPurposes
  };
};

export default useArticlePermissions;
