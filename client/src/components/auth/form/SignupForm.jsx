import { Form, Input, Button, Select, Spin } from 'antd';
import { createUser } from '@/services/users';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { toast } from 'react-toastify';
const { Option } = Select;

const SignupForm = observer(({ fields, setIsSignUp }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    const values = form.getFieldsValue();

    setIsLoading(true);
    const response = await createUser(values);

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
              rules={[
                { required: true, message: 'This field is required' },
                field.name === 'passwordConfirmation' && {
                  validator: (_, value) => {
                    if (!value || form.getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  }
                }
              ].filter(Boolean)}
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
              ) : (
                <Input type={field.type} />
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
              <span className='text-blue-500 cursor-pointer hover:underline' onClick={() => setIsSignUp(false)}>
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
