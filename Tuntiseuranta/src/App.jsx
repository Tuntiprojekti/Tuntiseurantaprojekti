import { Link, Outlet } from "react-router-dom";
import { AppBar, CssBaseline, Toolbar, Typography } from "@mui/material";

function App() {
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
            <Link to={"/auth"} style={{ marginLeft: '20px', marginRight: '20px' }}>auth</Link>
            <Link to={"/users"} style={{ marginLeft: '20px', marginRight: '20px' }}>User Management</Link> {/* Ensure this path is correct */}
          </Toolbar>
        </AppBar>
        <Outlet />
      </nav>
    </>
  );
}

export default App;
