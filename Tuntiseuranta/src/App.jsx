import { Link, Outlet } from "react-router-dom";
import { AppBar, CssBaseline, Toolbar, Typography, Button } from "@mui/material";
import { useAuth } from './context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import { useNavigate } from 'react-router-dom';

function App() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      window.alert('You have been logged out.');
      navigate('/auth'); // Redirect to the auth page after logout
    } catch (err) {
      console.error(err);
      window.alert('An error occurred during logout. Please try again.');
    }
  };

  return (
    <>
      <nav>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Tuntiseuranta</Typography>
            <div style={{ marginLeft: '20px' }} />
            <Link to={"/"} style={{ marginLeft: '20px', marginRight: '20px' }}>Shifts</Link>
            <Link to={"/statistics"} style={{ marginLeft: '20px', marginRight: '20px' }}>Statistics</Link>
            {/* <Link to={"/auth"} style={{ marginLeft: '20px', marginRight: '20px' }}>Auth</Link> */}
            <Link to={"/users"} style={{ marginLeft: '20px', marginRight: '20px' }}>User Management</Link>

            {currentUser && (
              <Button 
                onClick={logout} 
                color="inherit" 
                style={{ marginLeft: 'auto' }} // Pushes the button to the right
              >
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Outlet />
      </nav>
    </>
  );
}

export default App;
