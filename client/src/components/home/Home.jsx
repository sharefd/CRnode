import { Typography, Card, Row, Col } from 'antd';
import { homeLinks } from '@/utils/constants';
import { observer } from 'mobx-react';

const Home = observer(() => {
  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

  return (
    <div className='mt-8'>
      {user && (
        <>
          <Typography.Title level={4} className='text-center'>
            Welcome, {user ? user.firstName : 'None'}.
          </Typography.Title>
          <Typography variant='body' className='text-center'>
            Get started in 2 simple steps:
          </Typography>

          <Row
            gutter={[16, 16]}
            justify='center'
            align=''
            style={{ marginTop: '16px', paddingLeft: '32px', paddingRight: '32px', paddingBottom: '20px' }}>
            {homeLinks.map((navlink, index) => (
              <Col key={index} xs={20} sm={20} md={13} lg={13}>
                <div style={{ maxWidth: '' }}>
                  <a href={navlink.endpoint || '#'} style={{ textDecoration: 'none', display: 'block' }}>
                    <Card
                      className={`text-center h-150 p-2 border-2  ${
                        navlink.endpoint ? 'hover:bg-slate-50' : 'border-dotted hover:italic'
                      }`}
                      hoverable={navlink.endpoint}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div className='flex items-center justify-center mb-2'>
                          <navlink.Icon style={{ fontSize: '24px' }} />
                          <Typography.Text className='ml-2' strong>
                            {navlink.label}
                          </Typography.Text>
                        </div>
                        <Typography.Text style={{ marginTop: '8px' }}>{navlink.description}</Typography.Text>
                      </div>
                    </Card>
                  </a>
                </div>
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
});

export default Home;
