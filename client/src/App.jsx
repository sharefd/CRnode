import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Admin from './components/admin/Admin';
import UserSettings from './components/user/UserSettings';
import Home from './components/home/Home';
import Navbar from './components/home/Navbar';
import NewRequest from './components/requests/NewRequest';
import LoadingSpinner from './components/ui/LoadingSpinner';
import userStore from './stores/userStore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthPage from './components/auth/AuthPage';
import PurposesList from './components/purposes/PurposesList';

const RequestsList = lazy(() => import('./components/requests/RequestsList'));
const SuccessMessage = lazy(() => import('./components/requests/SuccessMessage'));
const ArticleList = lazy(() => import('./components/articles/ArticleList'));
const OlderArticles = lazy(() => import('./components/articles/OlderArticles'));

const isDevelopment = process.env.NODE_ENV === 'development';
const baseUrl = isDevelopment ? 'http://localhost:3001' : '';

const App = observer(() => {
  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

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
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/admin' element={<Admin />} />
            <Route path='/articles' element={<ArticleList />} />
            <Route path='/calendars' element={<PurposesList />} />
            <Route path='/older-articles' element={<OlderArticles />} />
            <Route path='/requests' element={<RequestsList />} />
            <Route path='/login' element={<AuthPage />} />
            <Route path='/settings' element={<UserSettings />} />
            <Route path='/requests/new' element={<NewRequest />} />
            <Route path='/requests/submitted' element={<SuccessMessage />} />
          </Routes>
        </Suspense>
      </Router>
      <ToastContainer />
    </>
  );
});

export default App;
