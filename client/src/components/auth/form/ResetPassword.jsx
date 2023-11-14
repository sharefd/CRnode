import { Form, Input, Spin, Typography, Button } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LogoContainer from '../LogoContainer';

const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3003/auth' : '/auth';
const { Text } = Typography;

const ResetPassword = () => {
  const { resetToken } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const [form] = Form.useForm();

  const navigate = useNavigate();

  const formContainerClass = 'flex flex-col justify-center h-[85vh]';

  const handleSubmit = async () => {
    if (!newPassword || !newConfirmPassword) {
      toast.error('Please fill out all required fields', { autoClose: 1500, pauseOnFocusLoss: false });
      return;
    } else if (newPassword !== newConfirmPassword) {
      toast.error('Passwords do not match.', { autoClose: 1500, pauseOnFocusLoss: false });
      return;
    } else if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.', { autoClose: 1500, pauseOnFocusLoss: false });
      return;
    }
    setIsResetting(true);
    try {
      await axios.post(`${API_URL}/reset-password/${resetToken}`, { newPassword });
      setIsResetting(false);

      toast.success('Password successfully reset.', { autoClose: 1500, pauseOnFocusLoss: false });
      navigate('/login');
    } catch (error) {
      console.error('Error resetting password:', error);
      setIsResetting(false);

      toast.error('Error resetting password.', { autoClose: 1500, pauseOnFocusLoss: false });
    }
  };

  return (
    <div className='flex justify-center items-center h-screen pb-10 auth'>
      <div className='flex flex-col md:flex-row w-full max-w-screen-lg h-[85vh]'>
        {/* Left Column */}
        <LogoContainer />

        {/* Right Column */}
        <div
          className={`w-full md:w-1/2 p-8 ${formContainerClass} bg-white relative overflow-y-auto md:rounded-r-2xl`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <Form layout='vertical' form={form} onFinish={handleSubmit}>
            <div className='scrollable-area px-8 w-full mx-auto'>
              <div id='resetPassword-form' style={{ marginTop: '30px', marginBottom: '30px' }}>
                <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  <p className='requiredLabel'>New Password</p>
                  <Input.Password value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </Form.Item>
                <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                  <p className='requiredLabel'>Confirm New Password</p>
                  <Input.Password value={newConfirmPassword} onChange={e => setNewConfirmPassword(e.target.value)} />
                </Form.Item>
                <div>
                  {isResetting ? (
                    <div className='text-center justify-center'>
                      <Spin />
                    </div>
                  ) : (
                    <div className='pb-4 sm:pb-8 w-full text-center'>
                      <div className='mt-8'>
                        <Button type='primary' htmlType='submit' className='login-button'>
                          Reset Password
                        </Button>
                        <div className='cursor-pointer mt-6' onClick={() => navigate('/login')}>
                          <Text className='text-gray-500 underline hover:text-blue-500'>Back to Login</Text>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
