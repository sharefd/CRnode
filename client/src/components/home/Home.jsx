import { Spin, Typography, Card, Row, Col } from 'antd';
import { fetchPurposes, getCanReadPermissions, getCanWritePermissions } from '@/services/purposes';
import userStore from '@/stores/userStore';
import { homeLinks } from '@/utils/constants';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';

const Home = observer(() => {
  const navigate = useNavigate();
  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);
  const { data: purposes, isLoading } = useQuery(['userPurposes', user?._id], () => fetchPurposes(user?._id), {
    enabled: !!user?._id
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (localUser === undefined) {
      navigate('/login');
      return;
    }

    const canReadPurposes = getCanReadPermissions(purposes, user._id).map(p => p.name);
    userStore.setCanRead(canReadPurposes);

    const canWritePurposes = getCanWritePermissions(purposes, user._id).map(p => p.name);
    userStore.setCanWrite(canWritePurposes);
  }, [isLoading]);

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
