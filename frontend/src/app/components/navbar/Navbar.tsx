"use client";

import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" color="inherit" noWrap>
          ACE Queries
        </Typography>
        <Button color="inherit" component={Link} href="/pages/dashboard">Dashboard</Button>
        <Button color="inherit" component={Link} href="/pages/data-lookup">Data Lookup</Button>
        <Button color="inherit" component={Link} href="/pages/manage-accounts">Manage Accounts</Button>
        <Button color="inherit" component={Link} href="/pages/add-records">Add Records</Button>
        <Button color="inherit" component={Link} href="/pages/system-log">System Log</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
