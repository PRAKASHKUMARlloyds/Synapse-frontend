import { BrowserRouter as Router } from 'react-router-dom';
import { Box, CssBaseline, Container } from '@mui/material';
import { RoutesList } from '../app/RouteList';

export const Layout = () => {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ minHeight: '80vh', py: 3 }}>
        <Container>
          <RoutesList />
        </Container>
      </Box>
    </Router>
  );
};