import { useState, useEffect } from 'react';
import { Form, Input, Button, Spin, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/userStore';
import { fetchUserFeedbacks } from '@/services/feedbacks';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { loginUser } from '@/services/users';
import { MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const LoginForm = observer(({ fields, appName, isForgotPassword, setIsForgotPassword }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const initialCredentials = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
  const [credentials, setCredentials] = useState(initialCredentials);
  const [fieldErrors, setFieldErrors] = useState(initialCredentials);
  const [emailResetField, setEmailResetField] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const emailValidated = query.get('emailValidated');
    if (emailValidated === 'true') {
      toast.success('Success, your email has been validated. Please login.', {
        autoClose: 5000,
        pauseOnFocusLoss: false
      });
    }
  }, [location]);

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
        navigate('/calendar');
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

  const handleForgotPassword = async () => {
    const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3003/auth' : '/auth';
    const emailToReset = emailResetField;

    if (!emailToReset) {
      toast.error('Please enter your email address.', { autoClose: 1500, pauseOnFocusLoss: false });
      return;
    }

    setIsSendingEmail(true);

    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email: emailToReset });
      console.log(response.data);
      toast.success('Password reset email sent. Please check your inbox.', {
        autoClose: 1500,
        pauseOnFocusLoss: false
      });
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      toast.error('Error sending forgot password email. Please try again later.', {
        autoClose: 1500,
        pauseOnFocusLoss: false
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <>
      {isForgotPassword ? (
        <Form layout='vertical' onFinish={handleForgotPassword}>
          <div className={isSendingEmail || isLoading ? '' : `scrollable-area`}>
            <div className='px-8 w-full mx-auto'>
              <Form.Item>
                <p className='requiredLabel'>Email</p>
                <Input
                  prefix={<MailOutlined style={{ color: 'rgb(128,128,128)' }} />}
                  placeholder='Email'
                  disabled={isSendingEmail}
                  value={emailResetField}
                  onChange={e => setEmailResetField(e.target.value)}
                />
              </Form.Item>
              <div>
                {isSendingEmail ? (
                  <div className='flex justify-center'>
                    <Spin />
                  </div>
                ) : (
                  <>
                    <div className='flex justify-center mt-8'>
                      <Button type='primary' htmlType='submit' className='login-button'>
                        Send Password Reset Email
                      </Button>
                    </div>
                    <div className='flex justify-center mt-5 cursor-pointer' onClick={() => setIsForgotPassword(false)}>
                      <Typography.Text className='text-gray-500 underline hover:text-blue-500'>
                        Back to login
                      </Typography.Text>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Form>
      ) : (
        <Form onFinish={handleSubmit}>
          <div className={isSendingEmail || isLoading ? 'overflow-hidden' : `scrollable-area`}>
            <div className='px-8 w-full mx-auto'>
              <div id='login-form' style={{ marginBottom: '30px' }}>
                {fields.map((field, index) => (
                  <div key={index}>
                    {field.name === 'password' ? (
                      <>
                        <div className='flex justify-between'>
                          <p className='requiredLabel'>{field.label}</p>
                          <Typography.Text
                            className='text-gray-500 underline hover:text-blue-500 cursor-pointer'
                            onClick={() => setIsForgotPassword(true)}
                          >
                            Forgot?
                          </Typography.Text>
                        </div>
                        <Form.Item
                          name={field.name}
                          rules={[{ required: field.required, message: fieldErrors[field.name] }]}
                          labelCol={{ span: 24 }}
                          wrapperCol={{ span: 24 }}
                        >
                          <Input
                            disabled={isLoading}
                            type={field.type}
                            value={credentials[field.name]}
                            onChange={e => setCredentials({ ...credentials, [field.name]: e.target.value })}
                          />
                        </Form.Item>
                      </>
                    ) : (
                      <>
                        <p className='requiredLabel'>{field.label}</p>
                        <Form.Item
                          name={field.name}
                          rules={[{ required: field.required, message: fieldErrors[field.name] }]}
                          labelCol={{ span: 24 }}
                          wrapperCol={{ span: 24 }}
                        >
                          <Input
                            disabled={isLoading}
                            type={field.type}
                            value={credentials[field.name]}
                            onChange={e => setCredentials({ ...credentials, [field.name]: e.target.value })}
                          />
                        </Form.Item>
                      </>
                    )}
                  </div>
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

                  <div className='flex justify-center mt-5 cursor-pointer ' onClick={() => navigate('/register')}>
                    <Typography.Text className='text-gray-500 underline hover:text-blue-500'>
                      New to {appName}? Create account
                    </Typography.Text>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Form>
      )}
    </>
  );
});

export default LoginForm;
