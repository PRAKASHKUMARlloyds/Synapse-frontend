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
import { Dashboard, People, Feedback, Settings } from '@mui/icons-material';
import { useLocation, Link as RouterLink } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const location = useLocation();
  const loggedInUser = { name: 'Prakash' }; // Replace with real user context

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Schedule', icon: <People />, path: '/admin/schedule' },
    { text: 'Feedback', icon: <Feedback />, path: '/admin/feedback' },
    { text: 'Candidates', icon: <People />, path: '/admin/candidates' },

  ];

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
          {loggedInUser.name.charAt(0)}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {loggedInUser.name}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: '#ffffff33', mx: 2, mb: 1 }} />

      <List>
        {menuItems.map(({ text, icon, path }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={path}
              selected={location.pathname === path}
              sx={{
                color: '#fff',
                '&.Mui-selected': {
                  backgroundColor: '#004225',
                  '&:hover': {
                    backgroundColor: '#005f27',
                  },
                },
                '&:hover': {
                  backgroundColor: '#006b2e',
                },
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