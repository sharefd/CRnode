import { useEffect, useState } from 'react';
import axios from 'axios';
import userStore from '@/stores/userStore';
import { PURPOSE_CHOICES } from '@/utils/constants';

export const useAllowedArticles = articles => {
  const [allowedArticles, setAllowedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = userStore.user;

  useEffect(() => {
    const fetchAllowedArticles = async () => {
      if (!userStore.permissions || userStore.permissions.length === 0) {
        try {
          const permissionsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/permissions/user/${user._id}`);
          userStore.setPermissions(permissionsResponse.data);
        } catch (error) {
          console.error('Error fetching permissions:', error);
        }
      }

      setIsLoading(true);

      let allowed = [];

      Object.keys(PURPOSE_CHOICES).forEach(purpose => {
        const userCanRead = userStore.permissions.find(p => p.purpose === purpose)?.canRead;
        if (userCanRead) {
          allowed.push(purpose);
        }
      });

      const allowedFilteredArticles = articles.filter(article => allowed.includes(article.purpose));
      setAllowedArticles(allowedFilteredArticles);
      setIsLoading(false);
    };

    if (user && articles) {
      fetchAllowedArticles();
    }
  }, [articles]);

  return { allowedArticles, isLoading };
};
