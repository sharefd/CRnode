import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import NewArticle from './components/articles/actions/NewArticle';
import Admin from './components/auth/Admin';
import AuthForm from './components/auth/AuthForm';
import Home from './components/home/Home';
import Navbar from './components/home/Navbar';
import NewRequest from './components/requests/NewRequest';
import LoadingSpinner from './helpers/LoadingSpinner';
import userStore from './stores/userStore';

const RequestsList = lazy(() => import('./components/requests/RequestsList'));
const SuccessMessage = lazy(() => import('./components/requests/SuccessMessage'));
const ArticleList = lazy(() => import('./components/articles/ArticleList'));
const OlderArticles = lazy(() => import('./components/articles/OlderArticles'));

const App = observer(() => {
  const [user, setUser] = useState(userStore.user);

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

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('CloudRoundsToken');
      if (token) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`);
          userStore.setUser(response.data);
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('CloudRoundsToken');
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <Router>
      <Navbar user={user} />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/articles' element={<ArticleList />} />
          <Route path='/older-articles' element={<OlderArticles />} />
          <Route path='/requests' element={<RequestsList />} />
          <Route path='/login' element={<AuthForm />} />
          <Route path='/requests/new' element={<NewRequest />} />
          <Route path='/requests/submitted' element={<SuccessMessage />} />
        </Routes>
      </Suspense>
    </Router>
  );
});

export default App;
