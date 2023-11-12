import { Form, Input, Button, Select, Spin, AutoComplete } from 'antd';
import { createUser } from '@/services/users';
import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { getInviteByToken, registerWithToken } from '@/services/invites';

const { Option } = Select;

const SignupForm = observer(({ fields, setIsSignUp }) => {
  const [emailSuggestions, setEmailSuggestions] = useState([]);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  const handleSubmit = async () => {
    const values = form.getFieldsValue();

    setIsLoading(true);

    let response;
    if (token) {
      response = await registerWithToken({ ...values, token });
    } else {
      response = await createUser(values);
    }

    setIsLoading(false);
    if (response && response.user) {
      toast.success('Successfully signed up', { autoClose: 1500, pauseOnFocusLoss: false });
      setIsSignUp(false);
      form.resetFields();
    } else if (response && response.response && response.response.data) {
      const errorMessage = response.response.data;
      toast.error(errorMessage, {
        autoClose: 2500,
        pauseOnFocusLoss: false
      });
    } else {
      toast.error('An error occurred during signup', {
        autoClose: 2500,
        pauseOnFocusLoss: false
      });
    }
  };

  useEffect(() => {
    if (token) {
      getInviteByToken(token)
        .then(invite => {
          form.setFieldsValue({ email: invite.email });
        })
        .catch(err => {
          console.error('Error fetching invite:', err);
        });
    }
  }, []);

  const usernameField = fields.find(field => field.name === 'username');
  const usernameRules = usernameField ? usernameField.rules : [];

  return (
    <Form form={form} onFinish={handleSubmit} initialValues={{ university: '' }}>
      <div className='p-8 w-full mx-auto'>
        <div id='signup-form' className='scrollable-area'>
          <h1 className='text-center text-2xl mb-4'>Sign Up</h1>
          {fields.map((field, index) => (
            <Form.Item
              key={index}
              label={field.label}
              name={field.name}
              rules={
                field.name === 'username'
                  ? usernameRules
                  : [
                      { required: true, message: 'This field is required' },
                      field.name === 'passwordConfirmation' && {
                        validator: (_, value) => {
                          if (!value || form.getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Passwords do not match'));
                        }
                      }
                    ].filter(Boolean)
              }
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}>
              {field.type === 'select' ? (
                <Select>
                  {field.choices &&
                    field.choices.map((choice, i) => (
                      <Option key={i} value={choice.value} disabled={!choice.value}>
                        {choice.label}
                      </Option>
                    ))}
                </Select>
              ) : field.name === 'email' ? (
                <AutoComplete
                  options={emailSuggestions.map(email => ({ value: email }))}
                  onSearch={value => {
                    // Generate email suggestions based on the user input
                    const suggestions = ['gmail.com', 'mail.utoronto.ca', 'utoronto.ca', 'medportal.ca']; // Add other domains as needed
                    setEmailSuggestions(suggestions.map(domain => `${value}@${domain}`));
                  }}>
                  <Input type={field.type} disabled={field.name === 'email' && token} />
                </AutoComplete>
              ) : (
                <Input type={field.type} disabled={field.name === 'email' && token} />
              )}
            </Form.Item>
          ))}
          <div className='mt-8 w-full text-center'>
            {isLoading ? (
              <Spin />
            ) : (
              <Button type='primary' className='signup-button' htmlType='submit'>
                Sign Up
              </Button>
            )}
            <p className='text-center py-8'>
              Already have an account?{' '}
              <span className='text-blue-500 cursor-pointer hover:underline' onClick={() => navigate('/login')}>
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </Form>
  );
});

export default SignupForm;
