import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Box, CssBaseline, Container } from '@mui/material';
import { CustomHeader } from './CustomHeader';
import { CustomFooter } from './CustomFooter';
import { RoutesList } from '../app/RouteList';

export const Layout = () => {
  return (
    <Router>
      <CssBaseline />
      <CustomHeader />
      <Box sx={{ minHeight: '80vh', py: 3 }}>
        <Container>
          <RoutesList />
        </Container>
      </Box>
      <CustomFooter />
    </Router>
  );
};
