import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Avatar,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import {
  Dashboard,
  People,
  Feedback,
  Logout
} from '@mui/icons-material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// Update the import path below if your store file is located elsewhere, e.g. '../../store' or '../../app/store'
import type { RootState } from '../../store';
// Update the path below to the correct location of authenticationSlice in your project
import { Role } from '../../redux/authenticationSlice';
import { logout } from '../../redux/authenticationSlice';
import path from 'path';

const drawerWidth = 240;

const Sidebar: React.FC = () => {

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };
  const handleOnClick = () => {

  };

  const location = useLocation();

  const role = useSelector((state: RootState) => state.authentiction.role);
  const loggedInUser = useSelector((state: RootState) => state.authentiction.user);

  const allMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Schedule', icon: <People />, path: '/admin/schedule' },
    { text: 'Feedback', icon: <Feedback />, path: '/admin/feedback' },
    { text: 'Candidates', icon: <People />, path: '/admin/candidates' },
    { text: "Logout", icon: <Logout style={{ transform: 'rotate(270deg)' }}/>, path: '/'}
  ];

  const menuItems =
    role === Role.HR
      ? allMenuItems
      : role === Role.Manager
        ? allMenuItems.filter(item =>
            ['Dashboard','Schedule', 'Feedback', 'Logout'].includes(item.text)
          )
        : [];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#007A33',
          color: '#fff',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: '#fff', color: '#007A33', fontWeight: 'bold' }}>
          {loggedInUser?.name?.charAt(0) ?? 'U'}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {loggedInUser?.name ?? 'User'}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: '#ffffff33', mx: 2, mb: 1 }} />

      <List>
        {menuItems.map(({ text, icon, path }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={path}
              onClick={(text === "Logout") ? handleLogout : handleOnClick}
              selected={location.pathname === path}
              sx={{
                color: '#fff',
                '&.Mui-selected': {
                  backgroundColor: '#004225',
                  '&:hover': { backgroundColor: '#005f27' },
                },
                '&:hover': { backgroundColor: '#006b2e' },
              }}
            >
              <ListItemIcon sx={{ color: '#fff' }}>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;