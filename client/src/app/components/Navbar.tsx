import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';


const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Task Management Application
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
