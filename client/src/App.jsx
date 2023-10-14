import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import axios from 'axios';
import NewArticle from './articles/NewArticle';
import ArticleList from './articles/ArticleList';
import AuthForm from './accounts/AuthForm';
import { userState } from './appState';
import { useRecoilValue } from 'recoil';

function App() {
  const user = useRecoilValue(userState);

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
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/articles' element={<ArticleList />} />
        <Route path='/articles/new' element={<NewArticle />} />
        <Route path='/manage-requests' element={<NewArticle />} />
        <Route path='/rounds-catalog' element={<NewArticle />} />
        <Route path='/login' element={<AuthForm />} />

        {/* other routes */}
      </Routes>
    </Router>
  );
}

export default App;
