import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar
} from '@mui/material';
import {
  People,
  EventAvailable,
  Schedule,
  Feedback,
  EmojiEvents,
  WarningAmber
} from '@mui/icons-material';

const stats = [
  { title: 'Total Interviews', value: 128, icon: <People /> },
  { title: 'Upcoming Interviews', value: 12, icon: <EventAvailable /> },
  { title: 'Awaiting Schedule', value: 2, icon: <Schedule /> },
  { title: 'Pending Feedback', value: 7, icon: <Feedback /> },
  { title: 'Avg Interview Score', value: '82%', icon: <EmojiEvents /> },
  { title: 'AI Flagged Candidates', value: 3, icon: <WarningAmber /> }
];

const InterviewStatsPanel: React.FC = () => {
  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: 4, backgroundColor: '#f5f9f7', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#007A33' }}>
        📊 Interview Metrics Overview
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3
        }}
      >
        {stats.map(({ title, value, icon }) => (
          <Box
            key={title}
            sx={{
              flex: '1 1 260px',
              maxWidth: '320px'
            }}
          >
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                padding: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                backgroundColor: '#ffffff',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            >
              <Avatar sx={{ bgcolor: '#007A33' }}>
                {icon}
              </Avatar>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 1 }}>
                  {value}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default InterviewStatsPanel;