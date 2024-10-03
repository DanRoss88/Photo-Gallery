import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
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
} from "@mui/material";
import { useAuth } from "../../Contexts/AuthContext";
import { useTheme } from "@mui/material/styles";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
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
    navigate("/");
  };

  return (
    <AppBar position="static" color="primary" elevation={0} className="app-bar">
      <Toolbar>
        <Typography
          className={`navbar-title sixtyfour-convergence-new`}
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold" }}
        >
          Photo Gallery
        </Typography>
        <Button
          className={`navbar-button sixtyfour-convergence-new`}
          color="inherit"
          component={RouterLink}
          to="/"
          sx={{ mx: 1 }}
        >
          Gallery
        </Button>
        {user && (
          <>
            <Button
              className={`navbar-button sixtyfour-convergence-new`}
              color="inherit"
              component={RouterLink}
              to="/bookmarks"
              sx={{ mx: 1 }}
            >
              Bookmarks
            </Button>
            <Button
              className={`navbar-button sixtyfour-convergence-new`}
              color="inherit"
              component={RouterLink}
              to="/upload"
              sx={{ mx: 1 }}
            >
              Upload
            </Button>
          </>
        )}
        <Button
          className={`navbar-button sixtyfour-convergence-new`}
          color="inherit"
          onClick={handleToggle}
          sx={{ mx: 1, borderRadius: theme.shape.borderRadius }}
        >
           {user ? "Logout" : "Login / Register"}
        </Button>
        <Popper
          open={open}
          anchorEl={anchorEl}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow">
                    {user ? (
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
