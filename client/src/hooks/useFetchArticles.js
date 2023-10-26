import { compareDates } from '@/utils/dates';
import axios from 'axios';
import { useEffect, useState } from 'react';

const isDevelopment = process.env.NODE_ENV === 'development';
const baseUrl = isDevelopment ? 'http://localhost:3001' : '';

export const useFetchArticles = (userStore, isUserLoaded) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/articles`);
        userStore.setPastArticles(response.data);

        let permittedArticles = response.data.filter(article => {
          return userStore.permissions.some(permission => permission.purpose === article.purpose && permission.canRead);
        });

        const sortedArticles = permittedArticles.sort((a, b) => {
          return compareDates(a, b);
        });

        userStore.setArticles(sortedArticles);
        setIsLoading(false);
      } catch (error) {
        console.error('There was an error fetching articles:', error);
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [isUserLoaded]);

  return { isLoading };
};
