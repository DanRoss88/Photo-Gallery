import { createTheme } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/material';

export const theme = createTheme({
    palette: {
      primary: {
        main: '#3f51b5',
        light: '#757de8',
        dark: '#002984',
      },
      secondary: {
        main: '#f50057',
        light: '#ff4081',
        dark: '#c51162',
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
      h6: {
        fontWeight: 500,
      },
      body1: {
        fontSize: '1rem',
      },
      button: {
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'box-shadow 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
            },
          },
        },
      },
    },
  });

  export const formContainerStyles: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 64px)',
  };
  
  export const formPaperStyles: SxProps<Theme> = {
    p: 4,
    maxWidth: 400,
    width: '100%',
  };
  
  export const formStyles: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  };
  