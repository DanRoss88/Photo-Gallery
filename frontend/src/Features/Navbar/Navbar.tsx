import React, { useContext, useState } from 'react';
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
import { AuthContext } from '../../App';

const Navbar: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setExpanded(false);
    navigate('/');
  };


  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Photo Gallery
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">
          Gallery
        </Button>
        <Button color="inherit" component={RouterLink} to="/upload">
          Upload
        </Button>
        <Accordion
          expanded={expanded === 'auth'}
          onChange={handleChange('auth')}
          sx={{ backgroundColor: 'transparent', boxShadow: 'none', color: 'inherit' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{isLoggedIn ? 'Account' : 'Login / Register'}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
              {isLoggedIn ? (
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <>
                  <Button color="inherit" component={RouterLink} to="/login" onClick={() => setExpanded(false)}>
                    Login
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/register" onClick={() => setExpanded(false)}>
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