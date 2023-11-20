import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spin, Alert } from 'antd';
import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';
const baseUrl = isDevelopment ? 'http://localhost:3003' : '';

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function validateRegisterToken() {
    try {
      const response = await axios.get(`${baseUrl}/auth/verify-email/${token}`);
      console.log(response.data.message);
      setLoading(false);
      navigate('/login?emailValidated=true');
    } catch (error) {
      setLoading(false);
      setError(error.message || 'Failed to verify email.');
    }
  }

  useEffect(() => {
    if (token) {
      validateRegisterToken();
    }
  }, [token]);

  if (loading) {
    return <Spin />;
  }

  if (error) {
    return <Alert message={error} type='error' />;
  }

  return null;
};

export default EmailVerification;
