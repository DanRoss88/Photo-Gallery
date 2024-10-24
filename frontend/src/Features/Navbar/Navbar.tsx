import { useState, MouseEvent, FC } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Button, MenuItem, Box, Menu } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../Contexts/AuthContext';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Navbar: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const navItems = [
    { text: 'Gallery', link: '/' },
    ...(user
      ? [
          { text: 'Bookmarks', link: '/bookmarks' },
          { text: 'Upload', link: '/upload' },
        ]
      : []),
    ...(user
      ? [{ text: 'Logout', onClick: handleLogout }]
      : [
          { text: 'Login', link: '/login' },
          { text: 'Register', link: '/register' },
        ]),
  ];

  const renderNavItems = (
    <>
      {navItems.map((item, index) => (
        <Button
          key={index}
          variant="outlined"
          color="inherit"
          component={item.link ? RouterLink : 'button'}
          to={item.link}
          onClick={item.onClick || handleMenuClose}
          sx={{
            mx: 1,
            fontFamily: '"Sixtyfour Convergence", sans-serif',
            fontWeight: 600,
            borderRadius: 20,
            transition: 'transform 0.3s ease, color 0.3s ease',
            fontSize: '.9rem',
            padding: '4px 8px',
            '&:hover': {
              transform: 'scale(1.05) rotate(-3deg)',
              color: '#ff4081',
            },
          }}
        >
          {item.text}
        </Button>
      ))}
    </>
  );

  return (
    <AppBar position="static" color="primary" elevation={0} sx={{ height: '100px', minWidth: '100vw' }}>
      <Toolbar sx={{ justifyContent: 'space-between', height: '100%' }}>
        {isMobile ? (
          <Box
            component="img"
            src="/android-chrome-192x192.png"
            alt="Photo Gallery"
            sx={{
              height: '40px',
              width: '40px',
            }}
          />
        ) : (
          <Typography
            variant="h3"
            component="div"
            sx={{
              fontFamily: '"Sixtyfour Convergence", sans-serif',
              fontWeight: 500,
              fontSize: { xs: '1.5rem', sm: '2rem' },
              textShadow: '0 0 4px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 0, 0, 0.5)',
            }}
          >
            Photo Gallery
          </Typography>
        )}
        {isMobile ? (
          <>
            <IconButton color="inherit" aria-label="open menu" edge="end" onClick={handleMenuOpen} sx={{ ml: 2 }}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                },
              }}
            >
              {navItems.map((item, index) => (
                <MenuItem
                  key={index}
                  component={item.link ? RouterLink : 'button'}
                  to={item.link}
                  onClick={item.onClick || handleMenuClose}
                  sx={{
                    fontFamily: '"Sixtyfour Convergence", sans-serif',
                    fontWeight: 400,
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  {item.text}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex' }}>{renderNavItems}</Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
