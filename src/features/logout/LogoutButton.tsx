import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/authenticationSlice';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); // or navigate('/login') if that's your login route
  };

  return (
    <Button variant="outlined" color="success" style={{marginLeft: "10px", float: "right"}} onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
