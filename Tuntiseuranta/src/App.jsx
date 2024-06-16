import { Link, Outlet } from "react-router-dom";
import { AppBar, Container, CssBaseline, Toolbar, Typography, Tabs, Box } from "@mui/material";


function App() {

  return (
    <>

      <nav>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">
              Tuntiseuranta
            </Typography>
            <div style={{ marginLeft: '20px' }} /> 
            <Link to={"/"} style={{ marginLeft: '20px', marginRight: '20px' }}>Shifts</Link>{' '} 
            <Link to={"/statistics"} style={{ marginLeft: '20px', marginRight: '20px' }}>Statistics</Link>{' '} 


          </Toolbar>
        </AppBar>
        <Outlet />
      </nav>

    </>
  )
}

export default App