import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Popper,
    Paper,
    Grow,
    ClickAwayListener,
    MenuList,
    MenuItem,
  } from '@mui/material';
import { useAuth } from '../../Contexts/AuthContext';
import { useTheme } from '@mui/material/styles';

const Navbar: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
  
    const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen((prevOpen) => !prevOpen);
    };
  
    const handleClose = (event: Event | React.SyntheticEvent) => {
      if (anchorEl && anchorEl.contains(event.target as HTMLElement)) {
        return;
      }
      setOpen(false);
    };
  
    const handleLogout = () => {
      logout();
      setOpen(false);
      navigate('/');
    };
  
    return (
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Photo Gallery
          </Typography>
          <Button color="inherit" component={RouterLink} to="/" sx={{ mx: 1 }}>
            Gallery
          </Button>
          <Button color="inherit" component={RouterLink} to="/upload" sx={{ mx: 1 }}>
            Upload
          </Button>
          <Button
            color="inherit"
            onClick={handleToggle}
            sx={{ mx: 1, borderRadius: theme.shape.borderRadius }}
          >
            {isLoggedIn ? 'Account' : 'Login / Register'}
          </Button>
          <Popper open={open} anchorEl={anchorEl} role={undefined} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList autoFocusItem={open} id="menu-list-grow">
                      {isLoggedIn ? (
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                      ) : (
                        <div>
                          <MenuItem
                            component={RouterLink}
                            to="/login"
                            onClick={handleClose}
                          >
                            Login
                          </MenuItem>
                          <MenuItem
                            component={RouterLink}
                            to="/register"
                            onClick={handleClose}
                          >
                            Register
                          </MenuItem>
                        </div>
                      )}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Toolbar>
      </AppBar>
    );
  };
  
  export default Navbar;