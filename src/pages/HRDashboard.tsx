import React from 'react';
import { Container, Box, Typography, Paper, Stack } from '@mui/material';

const contentArray = [
  { title: 'HR Policies', text: 'Details about HR policies and procedures.' },
  { title: 'Employee Benefits', text: 'Information on health, retirement, and perks.' },
  { title: 'Leave Tracker', text: 'Check your leave balance and request time off.' },
  { title: 'Performance Reviews', text: 'Guidelines and feedback for career growth.' },
];

export default function HRDashboard() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
         HR Dashboard
      </Typography>

      <Stack spacing={3}>
        {contentArray.map((item, index) => (
          <Paper key={index} elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {item.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {item.text}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}