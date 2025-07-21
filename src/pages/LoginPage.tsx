import React from 'react';
import { Container, Box, Paper } from '@mui/material';
import {Login} from '../components/customComponents/Login';

const LoginPage: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: 'rgb(246, 243, 242)', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Login />
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;