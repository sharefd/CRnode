import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Spin } from 'antd';
import { fetchCurrentUser } from './services/users';
import AuthPage from './components/auth/AuthPage';
import { useQuery } from 'react-query';
import Home from './components/home/Home';
import Navbar from './components/home/Navbar';
import 'react-toastify/dist/ReactToastify.css';

const PurposesList = lazy(() => import('./components/purposes/PurposesList'));
const RequestsList = lazy(() => import('./components/requests/RequestsList'));
const ArticleList = lazy(() => import('./components/articles/ArticleList'));
const OlderArticles = lazy(() => import('./components/articles/OlderArticles'));
const UserSettings = lazy(() => import('./components/user/UserSettings'));
const Admin = lazy(() => import('./components/admin/Admin'));

const App = observer(() => {
  const localUser = localStorage.getItem('CloudRoundsUser');
  const parsedUser = JSON.parse(localUser);

  const [user, setUser] = useState(parsedUser);

  const {
    data: fetchedUser,
    isLoading,
    isError
  } = useQuery('userData', fetchCurrentUser, {
    enabled: !!user
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (fetchedUser) {
      localStorage.setItem('CloudRoundsUser', JSON.stringify(fetchedUser));
      setUser(fetchedUser);
    }
  }, [isLoading, fetchedUser]);

  axios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('CloudRoundsToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  return (
    <>
      <Router>
        <Navbar user={user} />
        <Suspense fallback={<Spin />}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/admin' element={<Admin />} />
            <Route path='/articles' element={<ArticleList />} />
            <Route path='/calendars' element={<PurposesList />} />
            <Route path='/older-articles' element={<OlderArticles />} />
            <Route path='/requests' element={<RequestsList />} />
            <Route path='/login' element={<AuthPage />} />
            <Route path='/register' element={<AuthPage />} />
            <Route path='/settings' element={<UserSettings />} />
          </Routes>
        </Suspense>
      </Router>
      <ToastContainer />
    </>
  );
});

export default App;
