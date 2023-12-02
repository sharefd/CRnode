import { Form, Input, Button, Select, Spin, AutoComplete } from 'antd';
import { createUser } from '@/services/users';
import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { getInviteByToken, registerWithToken } from '@/services/invites';
import { getDomainSuggestions, generateEmailSuggestions } from '../fields/authFields';

const { Option } = Select;

const SignupForm = observer(({ fields, setIsSignUp }) => {
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  const handleSubmit = async () => {
    const values = form.getFieldsValue();

    setIsLoading(true);

    try {
      let response;

      if (token) {
        response = await registerWithToken({ ...values, token });
        toast.success('Successfully signed up. Please login to start using the platform.', {
          autoClose: 5000,
          pauseOnFocusLoss: false
        });
      } else {
        response = await createUser(values);
        toast.success('Successfully signed up. Please check your email to validate your account.', {
          autoClose: 5000,
          pauseOnFocusLoss: false
        });
      }

      setIsLoading(false);
      setIsSignUp(false);
      navigate('/login');
      form.resetFields();
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.data) {
        const errorMessage = error.response.data;
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

  const onUniversityChange = value => {
    setSelectedUniversity(value);

    const currentEmailValue = form.getFieldValue('email');

    if (currentEmailValue) {
      const domainSuggestions = getDomainSuggestions(value);
      setEmailSuggestions(generateEmailSuggestions(currentEmailValue, domainSuggestions));
    }
  };

  const onEmailSearch = value => {
    if (value === '') {
      setEmailSuggestions([]);
      return;
    }
    const domainSuggestions = getDomainSuggestions(selectedUniversity);
    setEmailSuggestions(generateEmailSuggestions(value, domainSuggestions));
  };

  const usernameField = fields.find(field => field.name === 'username');
  const usernameRules = usernameField ? usernameField.rules : [];

  return (
    <Form form={form} onFinish={handleSubmit} initialValues={{ university: '' }} className='signup-form'>
      <div className='p-8 py-2 md:py-0 w-full mx-auto'>
        <div id='signup-form' className={isLoading ? '' : `scrollable-area`}>
          <h1 className='authform-title'>Sign up</h1>
          {fields.map((field, index) => (
            <div key={index}>
              <p className='requiredLabel'>{field.label}</p>
              <Form.Item
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
                  <Select onChange={onUniversityChange}>
                    {field.choices &&
                      field.choices.map((choice, i) => (
                        <Option key={i} value={choice.value} disabled={!choice.value}>
                          {choice.label}
                        </Option>
                      ))}
                  </Select>
                ) : field.name === 'email' ? (
                  <AutoComplete options={emailSuggestions.map(email => ({ value: email }))} onSearch={onEmailSearch}>
                    <Input type={field.type} disabled={field.name === 'email' && token} />
                  </AutoComplete>
                ) : (
                  <Input type={field.type} disabled={field.name === 'email' && token} autoComplete='new-password' />
                )}
              </Form.Item>
            </div>
          ))}
          <div className='mt-8 w-full text-center'>
            {isLoading ? (
              <Spin />
            ) : (
              <Button type='primary' className='signup-button' htmlType='submit'>
                Sign Up
              </Button>
            )}
            <div className='flex justify-center mt-5 cursor-pointer ' onClick={() => navigate('/login')}>
              <p className='text-gray-500 underline hover:text-blue-500'>Already have an account? Login</p>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
});

export default SignupForm;
