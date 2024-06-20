import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { AppBar, CssBaseline, Toolbar, Typography } from "@mui/material";

const App = () => {
  const [shifts, setShifts] = useState([
    {
      shift: "morning",
      place: "Peijas",
      hoursWorked: 8,
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      dailySalary: 10 * 8,
    },
    {
      shift: "day",
      place: "Meilahti",
      hoursWorked: 8,
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 2),
      dailySalary: 12 * 8,
    },
    {
      shift: "night",
      place: "Jorvi",
      hoursWorked: 8,
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 3),
      dailySalary: 11 * 8 * 2,
    },
  ]);

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Tuntiseuranta</Typography>
          <div style={{ marginLeft: "20px" }} />
          <Link to="/" style={{ marginLeft: "20px", marginRight: "20px" }}>
            Shifts
          </Link>
          <Link
            to="/statistics"
            style={{ marginLeft: "20px", marginRight: "20px" }}
          >
            Statistics
          </Link>
        </Toolbar>
      </AppBar>
      <Outlet context={{ shifts, setShifts }} />
    </>
  );
};

export default App;
