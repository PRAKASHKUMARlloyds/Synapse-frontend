import { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Collapse,
  Divider,
  Avatar,
} from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import ChatInterface from './ChatInterface';
import AiInterviewPage from './AiInterviewPage';

export default function UserDashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const loggedInUser = useSelector(
    (state: RootState) => state.authentiction.user
  );

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const userInitial = loggedInUser?.name?.charAt(0)?.toUpperCase() ?? 'U';
  const userName = loggedInUser?.name ?? 'Candidate';

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* 🏦 Greeting Section */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 4,
          backgroundColor: '#f5f6f8',
          border: '1px solid #d6d9dc',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: '#003087', width: 56, height: 56 }}>
            {userInitial}
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: '#003087' }}
            >
              Welcome, {userName}
            </Typography>
    
          </Box>
        </Box>
      </Paper>

      {/*  AI Interview Section */}
      <Paper elevation={1} sx={{ p: 4, borderRadius: 2, backgroundColor: '#ffffff' }}>
        {/* <Typography variant="h6" gutterBottom color="text.primary">
          AI Interview Assistant
        </Typography> */}
        
        <AiInterviewPage />

        <Divider sx={{ my: 4 }} />

        {/* Chat Toggle */}
        <Box textAlign="center">
          <Button
            variant={isChatOpen ? 'outlined' : 'contained'}
            color="primary"
            onClick={toggleChat}
            sx={{ textTransform: 'none', minWidth: 200 }}
          >
            {isChatOpen ? 'Close Assistant Chat' : 'Open Assistant Chat'}
          </Button>
        </Box>

        <Collapse in={isChatOpen}>
          <Box sx={{ mt: 4 }}>
            <ChatInterface />
          </Box>
        </Collapse>
      </Paper>
    </Container>
  );
}