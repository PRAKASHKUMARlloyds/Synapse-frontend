import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Snackbar,
  Box,
  Typography,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, Role } from '../../redux/authenticationSlice';
import { RootState } from '../../store';

const Alert = React.forwardRef(function Alert(props: any, ref: any) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const storedRole = useSelector(
    (state: RootState) => state.authentication.role
  );

  const handleLogin = () => {
    console.log('Role');
    dispatch(login({ email, password }));
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
        default:
          setShowNotification(true);
      }
    }
  }, [storedRole, navigate]);

  return (
    <Box>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleLogin}
      >
        Login
      </Button>

      <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        onClose={() => setShowNotification(false)}
      >
        <Alert severity="error" onClose={() => setShowNotification(false)}>
          Invalid credentials or role
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
