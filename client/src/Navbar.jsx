import { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem
} from '@mui/material';
import { Link } from 'react-router-dom';

import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleClick = event => {
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

  const list = () => (
    <Box sx={{ width: 250 }} role='presentation' onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {navlink('Create Article', '/articles/new')}
        {navlink('Manage Requests', '/manage-requests')}
        {navlink('My Rounds', '/my-rounds')}
        {navlink('Past Rounds', '/past-rounds')}
        {navlink('Rounds Catalog', '/rounds-catalog')}
        <ListItem onClick={handleClick}>
          <Typography>{user && user.username}</Typography>
          <ArrowDropDown />
        </ListItem>
        <Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={handleClose}>Change Password</MenuItem>
          <MenuItem onClick={handleClose}>Log Out</MenuItem>
        </Menu>
      </List>
    </Box>
  );

  const navlink = (label, endpoint) => (
    <Typography variant='button' sx={{ mr: 2 }}>
      <Link to={endpoint} style={{ textDecoration: 'none', color: 'inherit' }}>
        {label}
      </Link>
    </Typography>
  );

  return (
    <AppBar position='static' sx={{ backgroundColor: '#7393B3' }}>
      <Toolbar>
        {user && (
          <>
            <IconButton edge='start' color='inherit' aria-label='menu' onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>

            <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
              {list()}
            </Drawer>
          </>
        )}
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          <Link to='/' style={{ textDecoration: 'none', color: 'inherit' }}>
            CloudRounds
          </Link>
        </Typography>
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.3, justifyContent: 'space-between' }}>
            {navlink('Create Article', '/articles/new')}
            {navlink('Manage Requests', '/manage-requests')}
            {navlink('My Rounds', '/articles')}
            {navlink('Past Rounds', '/past-rounds')}
            {navlink('Rounds Catalog', '/rounds-catalog')}
            <Box id='user' sx={{ mt: 0.1 }}>
              <IconButton color='primary' onClick={handleClick} sx={{ color: '#eaeaec', textTransform: 'none' }}>
                <Typography>{user.username}</Typography>
                <ArrowDropDown />
              </IconButton>
              <Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleClose}>Change Password</MenuItem>
                <MenuItem onClick={handleClose}>Log Out</MenuItem>
              </Menu>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.3, justifyContent: 'space-between' }}>
            <Link to='/login' style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button color='inherit'>Login</Button>
            </Link>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
