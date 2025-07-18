import React from 'react';
import { Container, Typography, Box } from '@mui/material';

export default function ManagerDashboard() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Manager Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to the manager's view. Here you can oversee team performance, approvals, and reports.
        </Typography>
      </Box>
    </Container>
  );
}