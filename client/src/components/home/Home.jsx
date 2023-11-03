import { Spin, Typography, Card, Row, Col } from 'antd';
import userStore from '@/stores/userStore';
import { homeLinks } from '@/utils/constants';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { fetchCurrentUser } from '@/services/users';

const Home = observer(() => {
  const navigate = useNavigate();
  const [user, setUser] = useState(userStore.user);

  const {
    data: fetchedUser,
    isLoading,
    isError
  } = useQuery('userData', fetchCurrentUser, {
    enabled: !user
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (fetchedUser) {
      localStorage.setItem('CloudRoundsUser', JSON.stringify(fetchedUser));
      setUser(fetchedUser);
    } else if (!user) {
      navigate('/login');
    }
  }, [isLoading, fetchedUser]);

  if (isLoading) {
    return <Spin />;
  }

  return (
    <div style={{ marginLeft: '16px', marginTop: '16px' }}>
      {user ? (
        <>
          <Typography.Title level={4}>Welcome, {user ? user.firstName : 'None'}.</Typography.Title>
          <Typography.Text>To get started, navigate to My Calendar and create an event.</Typography.Text>
          <Row gutter={[16, 16]} style={{ marginTop: '16px', paddingLeft: '32px', paddingRight: '32px' }}>
            {homeLinks.map((navlink, index) => (
              <Col key={index} xs={24} md={12}>
                <a href={navlink.endpoint} style={{ textDecoration: 'none' }}>
                  <Card className='text-center h-150 p-2 hover:bg-slate-50' hoverable>
                    <div className='flex items-center justify-center mb-2'>
                      <navlink.Icon style={{ fontSize: '24px' }} />
                      <Typography.Text className='ml-2' strong>
                        {navlink.label}
                      </Typography.Text>
                    </div>
                    <Typography.Text style={{ marginTop: '8px' }}>{navlink.description}</Typography.Text>
                  </Card>
                </a>
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <Typography.Title level={4} style={{ color: 'gray' }}>
          You are not logged in.
        </Typography.Title>
      )}
    </div>
  );
});

export default Home;
