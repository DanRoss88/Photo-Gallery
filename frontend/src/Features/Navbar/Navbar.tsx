import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuth } from '../../Contexts/AuthContext';
import { useTheme } from '@mui/material/styles';

const Navbar: React.FC = () => {
    const [expanded, setExpanded] = useState<string | false>(false);
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
  
    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  
    const handleLogout = () => {
      logout();
      setExpanded(false);
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
          <Accordion
            expanded={expanded === 'auth'}
            onChange={handleChange('auth')}
            sx={{
              backgroundColor: 'transparent',
              boxShadow: 'none',
              color: 'inherit',
              '& .MuiAccordionSummary-root': {
                minHeight: 'auto',
                '&.Mui-expanded': {
                  minHeight: 'auto',
                },
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ px: 2, '&.Mui-expanded': { minHeight: 'auto' } }}
            >
              <Typography>{isLoggedIn ? 'Account' : 'Login / Register'}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                {isLoggedIn ? (
                  <Button
                    color="inherit"
                    onClick={handleLogout}
                    sx={{ my: 1, borderRadius: theme.shape.borderRadius }}
                  >
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button
                      color="inherit"
                      component={RouterLink}
                      to="/login"
                      onClick={() => setExpanded(false)}
                      sx={{ my: 1, borderRadius: theme.shape.borderRadius }}
                    >
                      Login
                    </Button>
                    <Button
                      color="inherit"
                      component={RouterLink}
                      to="/register"
                      onClick={() => setExpanded(false)}
                      sx={{ my: 1, borderRadius: theme.shape.borderRadius }}
                    >
                      Register
                    </Button>
                  </>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Toolbar>
      </AppBar>
    );
  };
  
  export default Navbar;