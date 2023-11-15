import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import userStore from '@/stores/userStore';
import { LogoutOutlined, MenuOutlined, SettingOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import CloudLogo from '@/assets/images/logo.png';
import { navlinks as links, sideMenuLinks } from '@/utils/constants';
import './Newbar.css';
import { Avatar, Dropdown, Drawer, List } from 'antd';

const Newbar = observer(() => {
  const localUser = localStorage.getItem('CloudRoundsUser');
  const user = JSON.parse(localUser);

  const [activeIndex, setActiveIndex] = useState(0);
  const navbarRef = useRef(null);
  const horiSelectorRef = useRef(null);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [activeIndicatorStyle, setActiveIndicatorStyle] = useState({ width: 0, left: 0 });

  useEffect(() => {
    const updateActiveIndicator = () => {
      const navbar = navbarRef.current;
      if (navbar) {
        const activeLink = navbarRef.current.querySelector('li.active');
        if (activeLink) {
          const { offsetWidth: width, offsetLeft: left } = activeLink;
          setActiveIndicatorStyle({ width, left });
        }
      }
    };

    updateActiveIndicator();
    window.addEventListener('resize', updateActiveIndicator);

    return () => window.removeEventListener('resize', updateActiveIndicator);
  }, [activeIndex]);

  const handleNavCollapse = () => {
    setDrawerVisible(!drawerVisible);
  };

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
        <button
          type='button'
          onClick={() => {
            navigate(link.endpoint);
            setDrawerVisible(false);
          }}>
          <link.Icon />
          {link.label}
        </button>
      )
    })),
    {
      key: 'logout',
      content: (
        <button type='button' onClick={handleLogout}>
          <LogoutOutlined /> Log Out
        </button>
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

  const navlinkItems = links.map((link, index) => ({
    key: link.endpoint,
    icon: link.Icon || null,
    onClick: () => {
      setActiveIndex(index);
      navigate(link.endpoint);
    }
  }));

  const avatarMenuItem = {
    key: 'userDropdown',
    label: (
      <div className='flex items-center w-[64px] justify-center'>
        <Dropdown menu={{ items }} overlayStyle={{ top: '52px' }}>
          <Avatar className='cursor-pointer'>{getInitials(user)}</Avatar>
        </Dropdown>
      </div>
    )
  };

  const navbarDesktopItems = [...navlinkItems, avatarMenuItem];

  return (
    <nav ref={navbarRef} className='navbar-mainbg p-0 flex justify-between items-center h-16'>
      <div className='navbar-logo'>
        <Link to='/' className='flex items-center space-x-2 text-white text-lg p-3'>
          <img src={CloudLogo} width='40' alt='CloudRounds Logo' />
          <span className='text-white text-lg ml-2'>CloudRounds</span>
        </Link>
      </div>

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
      <div id='navbar-animmenu'>
        <ul className='show-dropdown main-navbar'>
          <div
            ref={horiSelectorRef}
            className='hori-selector'
            style={{
              backgroundColor: activeIndex === 1 ? '#f3f4f6' : '#fff',
              width: `${activeIndicatorStyle.width}px`,
              transform: `translateX(${activeIndicatorStyle.left}px)`
            }}>
            <div className={`left`}></div>
            <div className={`right`}></div>
          </div>
          {/* Map your nav items here */}
          {navbarDesktopItems.map((item, index) => (
            <li
              key={item.key}
              className={`${index === activeIndex ? 'active' : ''} p-2 pb-[0px] rounded-full `}
              onClick={item.onClick}>
              {item.label ? (
                item.label
              ) : (
                <Link className='flex items-center justify-center' style={{ height: '36px' }}>
                  <item.icon />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div id='navbar-mobile'>
        <button className='p-3 text-white md:hidden' onClick={handleNavCollapse}>
          <MenuOutlined />
        </button>
      </div>
    </nav>
  );
});

export default Newbar;
