import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import userStore from '@/stores/userStore';
import { Layout, Menu, Avatar, Dropdown, Button, Drawer, List, Space } from 'antd';
import { LogoutOutlined, MenuOutlined, SettingOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import CloudLogo from '@/assets/images/logo.png';
import { navlinks as links, sideMenuLinks } from '@/utils/constants';
import { useMediaQuery } from '@mui/material';
import styles from './Navbar.module.css';

const { Header } = Layout;

const Navbar = observer(() => {
  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:950px)');

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    userStore.setUser(null);
    userStore.setArticles([]);
    userStore.setSubmittedRequests([]);
    userStore.setFeedbacks([]);
    userStore.setPermissions([]);
    userStore.setCanRead([]);
    userStore.setCanWrite([]);
    localStorage.removeItem('CloudRoundsToken');
    localStorage.removeItem('CloudRoundsUser');

    navigate('/login');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  if (!user) {
    return null;
  }

  const getInitials = user => {
    if (user && user.firstName && user.lastName) {
      return user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase();
    }
    return '';
  };

  const drawerItems = [
    ...sideMenuLinks.map(link => ({
      key: link.endpoint,
      content: (
        <Button
          type='text'
          icon={link.Icon ? <link.Icon /> : null}
          onClick={() => {
            navigate(link.endpoint);
            setDrawerVisible(false);
          }}
          block>
          {link.label}
        </Button>
      )
    })),
    {
      key: 'logout',
      content: (
        <Button type='text' icon={<LogoutOutlined />} onClick={handleLogout} block>
          Log Out
        </Button>
      )
    }
  ];

  const drawerItemStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%'
  };

  const items = [
    {
      key: '0',
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => handleSettingsClick()
    },
    {
      key: '1',
      label: 'Log Out',
      icon: <LogoutOutlined />,
      onClick: () => handleLogout()
    }
  ];

  const navlinkItems = links.map(link => ({
    key: link.endpoint,
    icon: link.Icon ? <link.Icon className={styles.navlinkIcon} /> : null,
    onClick: () => navigate(link.endpoint)
  }));

  const avatarMenuItem = {
    key: 'userDropdown',
    label: (
      <Dropdown menu={{ items }} trigger={['click']} overlayStyle={{ top: '54px' }} className={styles.navlinkAvatar}>
        <Avatar className='cursor-pointer mr-3'>{getInitials(user)}</Avatar>
      </Dropdown>
    )
  };

  const navbarDesktopItems = [...navlinkItems, avatarMenuItem];

  return (
    <Header className={styles['navbar-header']}>
      <Link to='/' className='flex items-center flex-row'>
        <img src={CloudLogo} width='40' alt='CloudRounds Logo' />
        <span className='text-white text-lg ml-2'>CloudRounds</span>
      </Link>

      {user && (
        <>
          <div style={{ display: isSmallScreen ? 'none' : 'flex' }} className={styles['navbar-desktop']}>
            <Menu
              mode='horizontal'
              selectedKeys={[location.pathname]}
              items={navbarDesktopItems}
              className={styles['navbar-desktop']}
            />
          </div>

          <div className={styles['navbar-mobile']}>
            <Button type='text' onClick={() => setDrawerVisible(true)}>
              <MenuOutlined className='text-white' />
            </Button>
          </div>
        </>
      )}

      <Drawer
        title={
          <div className='flex items-center text-gray-700 justify-start'>
            <Avatar>{getInitials(user)}</Avatar>
            <span className='ml-2'>{user.username}</span>
          </div>
        }
        placement='right'
        closable={false}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={250}
        style={{ border: 'none' }}>
        <List
          itemLayout='horizontal'
          dataSource={drawerItems}
          renderItem={item => <List.Item style={{ padding: '12px 0', ...drawerItemStyle }}>{item.content}</List.Item>}
        />
      </Drawer>
    </Header>
  );
});

export default Navbar;
