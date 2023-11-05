import { useState } from 'react';
import { Form, Input, Button, Spin, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/userStore';
import { fetchUserFeedbacks } from '@/services/feedbacks';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { loginUser } from '@/services/users';

const LoginForm = observer(({ fields, setIsSignUp, appName }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const initialCredentials = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
  const [credentials, setCredentials] = useState(initialCredentials);
  const [fieldErrors, setFieldErrors] = useState(initialCredentials);

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!credentials.username || !credentials.password) {
      toast.error('Invalid or empty fields. Please enter a valid username and password.', {
        autoClose: 2500,
        pauseOnFocusLoss: false
      });
      return;
    }

    try {
      const response = await loginUser(credentials.username, credentials.password);
      userStore.setUser(response.user);
      localStorage.setItem('CloudRoundsToken', response.token);
      localStorage.setItem('CloudRoundsUser', JSON.stringify(response.user));

      const feedbacks = await fetchUserFeedbacks(response.user._id);
      userStore.setFeedbacks(feedbacks);

      setTimeout(() => {
        setIsLoading(false);
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials and try again.', {
        autoClose: 2500,
        pauseOnFocusLoss: false
      });
      setIsLoading(false);
    }
  };

  return (
    <Form onFinish={handleSubmit}>
      <div className='scrollable-area'>
        <div className='px-8 py-2 w-full mx-auto'>
          <div id='login-form' style={{ marginTop: '30px', marginBottom: '30px' }}>
            {fields.map((field, index) => (
              <Form.Item
                key={index}
                label={field.label}
                name={field.name}
                rules={[{ required: field.required, message: fieldErrors[field.name] }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <Input
                  type={field.type}
                  value={credentials[field.name]}
                  onChange={e => setCredentials({ ...credentials, [field.name]: e.target.value })}
                />
              </Form.Item>
            ))}
          </div>
          {isLoading ? (
            <div className='flex w-full justify-center text-center'>
              <Spin />
            </div>
          ) : (
            <div className='pb-4 sm:pb-8 w-full text-center'>
              <div className='flex justify-center mt-8'>
                <Button type='primary' htmlType='submit' className='login-button'>
                  Login
                </Button>
              </div>
              <div className='flex justify-center mt-4'>
                <Typography.Text>
                  New to {appName}?{' '}
                  <span className='text-blue-500 cursor-pointer hover:underline' onClick={() => navigate('/register')}>
                    Create account
                  </span>
                </Typography.Text>
              </div>
            </div>
          )}
        </div>
      </div>
    </Form>
  );
});

export default LoginForm;
