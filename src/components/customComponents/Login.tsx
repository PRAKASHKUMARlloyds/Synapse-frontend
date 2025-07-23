import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store.ts';
import { login, Role } from '../../redux/authenticationSlice';
import credentials from '../../data/user-credentials.json';
import {
  getEmailValidationMessage,
  getPasswordValidationMessage,
} from '../../helpers/login-validation.ts';
import { toast } from 'react-toastify';

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

    if (emailError || passwordError) {
      toast.error(emailError || passwordError);
      return;
    }

    const matchedUser = credentials.users.find(
      (user) => user.email === email && user.password === password
    );

    if (!matchedUser) {
      toast.error('Invalid email or password');
      return;
    }

    toast.success('Login successful 🎉');

    dispatch(
      login({
        email: matchedUser.email,
        password: matchedUser.password,
        role: matchedUser.role.toLowerCase() as Role,
        name: matchedUser.name, 
      })
    );
  };

  useEffect(() => {
    if (storedRole !== Role.None) {
      switch (storedRole) {
        case Role.User:
          navigate('/user-dashboard');
          break;
        case Role.HR:
          navigate('/admin/dashboard');
          break;
        case Role.Manager:
          navigate('/admin/dashboard');
          break;
      }
    }
  }, [storedRole, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f6fa',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 10,
      }}
    >
      <Box sx={{ maxWidth: 320, width: '100%', p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 3, textAlign: 'center' }}>
        <img
          src="https://play-lh.googleusercontent.com/y21EHperEeE9F8Ic147ZZSNE3icefFnAzWUvsEr3jHdnVmpnfBjsu1ARVcRLu8f1QYNi=w240-h480-rw"
          alt="Login Illustration"
          style={{ width: 100, height: 100, marginBottom: 8 }}
        />

       <div>
        <AccountCircle sx={{ fontSize: 60, color: 'primary.main' }} />
        <Typography variant="h5" sx={{ mt: 1, mb: 2 }}>
          Login
        </Typography>
        </div>

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

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Need help logging in? Reach out to our Talent Acquisition team at:
          </Typography>
          <Typography variant="body2" color="primary">
            talentacquisition.team@ltc.com
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
