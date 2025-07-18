import { useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import ChatInterface from './ChatInterface';

export default function UserDashboard() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Dashboard
      </Typography>

      {!isChatOpen && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenChat}
          >
            Open Chat
          </Button>
        </Box>
      )}

      {isChatOpen && (
        <Box sx={{ mt: 4 }}>
          <ChatInterface />
        </Box>
      )}
    </Container>
  );
}
