import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const isDevelopment = process.env.NODE_ENV === 'development';
const baseUrl = isDevelopment ? 'http://localhost:3003' : '';

const SessionCheck = ({ setLoggedInUser }) => {
  const navigate = useNavigate();

  const isNonAuthPath = () => {
    const nonAuthPatterns = [/^\/login$/, /^\/register$/, /^\/forgot-password$/, /^\/reset-password\/.+$/];

    return nonAuthPatterns.some(pattern => pattern.test(window.location.pathname));
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(`${baseUrl}/auth/session-check`);
        if (response.data.valid) {
          setLoggedInUser(response.data.user);
        } else {
          throw new Error('Session invalid');
        }
      } catch (error) {
        navigate('/login');
      }
    };

    checkSession();
  }, [navigate, setLoggedInUser]);

  return null;
};

export default SessionCheck;
