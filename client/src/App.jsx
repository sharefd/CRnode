import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import axios from 'axios';
import NewArticle from './articles/NewArticle';
import ArticleList from './articles/ArticleList';
import AuthForm from './auth/AuthForm';
import { userState } from './appState';
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import RequestsList from './requests/RequestsList';
import NewRequest from './requests/NewRequest';
import OlderArticles from './articles/past/OlderArticles';
import SubmittedRequests from './requests/SubmittedRequests';
import Admin from './auth/Admin';

function App() {
  const [user, setUser] = useRecoilState(userState);

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
    const token = localStorage.getItem('CloudRoundsToken');
    if (token) {
      axios
        .get('http://localhost:3001/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('CloudRoundsToken');
        });
    }
  }, []);

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/articles' element={<ArticleList />} />
        <Route path='/articles/new' element={<NewArticle />} />
        <Route path='/older-articles' element={<OlderArticles />} />
        <Route path='/requests' element={<RequestsList />} />
        <Route path='/login' element={<AuthForm />} />
        <Route path='/requests/new' element={<NewRequest />} />
        <Route path='/requests/submitted' element={<SubmittedRequests />} />
      </Routes>
    </Router>
  );
}

export default App;
