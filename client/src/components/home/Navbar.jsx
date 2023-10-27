import { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton, Drawer, Divider } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link, useNavigate } from 'react-router-dom';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';
import { navlinks, userlinks } from '@/utils/constants';
import CloudLogo from '@/assets/images/logo.png';
import { observer } from 'mobx-react';
import userStore from '@/stores/userStore';

const Navbar = observer(() => {
  const isSmallScreen = useMediaQuery('(max-width:950px)');
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [links, setLinks] = useState([]);
  const navigate = useNavigate();

  const user = userStore.user;

  useEffect(() => {
    if (user) {
      const permittedLinks = user.isAdmin ? navlinks : userlinks;
      setLinks(permittedLinks);
    }
  }, [user]);

  const handleClick = event => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = open => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    userStore.setUser(null);
    userStore.setArticles([]);
    userStore.setSubmittedRequests([]);
    userStore.setFeedbacks([]);
    userStore.setPermissions([]);
    localStorage.removeItem('CloudRoundsToken');
    handleClose();
    navigate('/login');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    handleClose();
  };

  const navlink = (label, endpoint, index) => (
    <Link key={index} to={endpoint} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box sx={{ py: '10px', mx: 1, borderRadius: '5px', '&:hover': { color: '#eaeaec' } }}>
        <Typography sx={{ ml: '3px' }}>{label}</Typography>
      </Box>
    </Link>
  );

  const list = () => (
    <Box
      sx={{
        width: 250,
        padding: '1rem .5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
      role='presentation'
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}>
      <div>{links.map((link, index) => navlink(link.label, link.endpoint, index))}</div>
      <Divider sx={{ borderWidth: '3px', backgroundColor: '#7793b1', mx: 1 }} />
      <Box
        sx={{
          borderTop: '1px solid #ccc',
          paddingTop: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          mx: 1
        }}>
        <Typography sx={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{user && user.username}</Typography>
        <IconButton onClick={null} sx={{ fontSize: '15px', marginBottom: '0.5rem', borderRadius: '5px' }}>
          Change Password
        </IconButton>
        <IconButton onClick={handleLogout} sx={{ fontSize: '15px', borderRadius: '5px' }}>
          Log Out
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <AppBar position='static' sx={{ backgroundColor: '#0066b2' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }} direction='row'>
          <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }} direction='row'>
              <img src={CloudLogo} width='40' />
              <p style={{ fontSize: '20px', marginLeft: '8px' }}>CloudRounds</p>
            </Box>
          </Link>
        </Box>
        {user && !isSmallScreen ? (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.3, justifyContent: 'space-between' }}>
            {links.map((link, index) => navlink(link.label, link.endpoint, index))}
            <Box id='user' sx={{ mt: 0.1 }}>
              <IconButton
                color='primary'
                onClick={handleClick}
                sx={{ ml: 1, color: '#eaeaec', textTransform: 'none', '&:hover': { color: '#fff' } }}>
                <Typography>{user.username}</Typography>
                <ArrowDropDown />
              </IconButton>
              <Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleSettingsClick}>Settings</MenuItem>
                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
              </Menu>
            </Box>
          </Box>
        ) : (
          user && (
            <>
              <IconButton edge='start' color='inherit' aria-label='menu' onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>

              <Drawer anchor='right' open={drawerOpen} onClose={toggleDrawer(false)}>
                {list()}
              </Drawer>
            </>
          )
        )}
        {!user && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.3, justifyContent: 'space-between' }}>
            <Link to='/login' style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button color='inherit'>Login</Button>
            </Link>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
});

export default Navbar;
