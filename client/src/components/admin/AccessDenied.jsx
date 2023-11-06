import { Result, Button } from 'antd';

const AccessDenied = () => {
  return (
    <Result
      status='403'
      title='403'
      subTitle='Sorry, you do not have permission to access this page.'
      extra={
        <Button type='primary' href='/'>
          Back Home
        </Button>
      }
    />
  );
};

export default AccessDenied;
