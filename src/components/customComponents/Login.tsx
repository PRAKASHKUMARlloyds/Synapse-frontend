import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardMedia,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store.ts';
import { login, Role } from '../../redux/authenticationSlice';
import credentials from '../../data/user_credentials.json';
import {
  getEmailValidationMessage,
  getPasswordValidationMessage,
} from '../../helper/login_validation';

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const storedRole = useSelector(
    (state: RootState) => state.authentiction.role
  );

  const handleLogin = () => {
    const emailError = getEmailValidationMessage(email);
    const passwordError = getPasswordValidationMessage(password);

    if (emailError) {
      setNotification(emailError);
      return;
    }

    if (passwordError) {
      setNotification(passwordError);
      return;
    }

    const matchedUser = credentials.users.find(
      (user) => user.email === email && user.password === password
    );

    if (!matchedUser) {
      setNotification('Invalid email or password');
      return;
    }

    setNotification(null);

    dispatch(login({
      email: matchedUser.email,
      password: matchedUser.password,
      role: matchedUser.role.toLowerCase() as Role
    }));
  };

  useEffect(() => {
    if (storedRole !== Role.None) {
      switch (storedRole) {
        case Role.User:
          navigate('/user-dashboard');
          break;
        case Role.HR:
          navigate('/hr-dashboard');
          break;
        case Role.Manager:
          navigate('/manager-dashboard');
          break;
      }
    }
  }, [storedRole, navigate]);

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: 'auto',
        mt: 8,
        p: 4,
      }}
    >
      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <CardMedia
          component="img"
          sx={{ width: { xs: '100%', md: '50%' } }}
          image="http://localhost:8085/loginbg.jpg"
          alt="Login Image"
        />
        <Box sx={{ p: 4, flexGrow: 1 }}>
          <Typography variant="h4" gutterBottom>
            Log in to your AI Interview Panel
          </Typography>

          {notification && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {notification}
            </Alert>
          )}

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLogin();
            }}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <Box mt={4}>
            <Typography variant="h6">Need Help?</Typography>
            <Typography variant="body2" paragraph>
              Chat to a member of our team online now using live chat.
            </Typography>
            <Typography variant="body2" paragraph>
              Monday to Friday, 9am-5pm.
            </Typography>
            <Typography variant="body2" paragraph>
              We’re always busy helping our customers. There may be peak times during the day
              when you can’t speak to us straight away. Please try again later or{' '}
              <a
                href="https://www.scottishwidows.co.uk/contact-us/#give-us-a-call"
                target="_blank"
                rel="noopener noreferrer"
              >
                get in touch
              </a>{' '}
              another way.
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};
