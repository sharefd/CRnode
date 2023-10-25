import { useEffect, useState } from 'react';
import { useFetchArticles } from '@/hooks/useFetchArticles';
import { inject, observer } from 'mobx-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const withArticles = WrappedComponent => {
  const WithArticlesComponent = inject('userStore')(
    observer(({ userStore, ...otherProps }) => {
      const [isUserLoaded, setIsUserLoaded] = useState(false);
      const { isLoading } = useFetchArticles(userStore, isUserLoaded);

      const user = userStore.user;
      Fwi;

      useEffect(() => {
        if (user) {
          setIsUserLoaded(true);
        }
      }, [user]);

      if (!isUserLoaded || isLoading) {
        return <LoadingSpinner />;
      }

      return (
        <WrappedComponent isLoading={isLoading} isUserLoaded={isUserLoaded} userStore={userStore} {...otherProps} />
      );
    })
  );

  return WithArticlesComponent;
};

export default withArticles;
