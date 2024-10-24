import { createTheme } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/material';
import styled from '@emotion/styled';

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
      default: '#171A1A',
      paper: '#2F3334',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#E0E0E0',
    },
  },
  typography: {
    h1: {
      fontFamily: '"Sixtyfour Convergence", sans-serif',
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h3: {
      fontFamily: '"Sixtyfour Convergence", sans-serif',
      fontWeight: 500,
      fontSize: '2rem',
    },
    h4: {
      fontFamily: '"Sixtyfour Convergence", sans-serif',
      fontWeight: 500,
      fontSize: '1.6rem',
    },
    h6: {
      fontFamily: '"Sixtyfour Convergence", sans-serif',
      fontWeight: 400,
      fontSize: '1.3rem',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 500,
      fontFamily: 'Rajdhani, Arial, sans-serif',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      fontFamily: 'Rajdhani, Arial, sans-serif',
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
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          height: '100px',
          minWidth: '100vw',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: '#999999',
          borderRadius: '4px',
          padding: '8px',
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h3: {
          textShadow: '0 0 4px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 0, 0, 0.5)',
        },
        h4: {
          textShadow: '0 0 24px rgba(255, 255, 255, 0.5), 0 0 12px rgba(255, 0, 0, 0.5)',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          justifyContent: 'center',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#757de8',
          '&:hover': {
            backgroundColor: '#6495ED',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 400,
          fontSize: '1rem',
          fontFamily: '"Sixtyfour Convergence", sans-serif',
          marginRight: '16px',
          '&.Mui-selected': {
            color: '#757de8',
          },
          '&.Mui-focusVisible': {
            backgroundColor: '#6495ED',
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#999999',
          '&.Mui-focused': {
            color: '#ff4081',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#f5f5f5',
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.87)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ff4081',
            },
          },
          '& .MuiInputBase-input': {
            color: 'rgba(0, 0, 0, 0.87)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#4c5456',
          boxShadow: '0 4px 6px rgb(76, 84, 86)',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 12px rgb(76, 84, 86)',
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
  minHeight: '60vh',
  maxWidth: '80vw',
  mt: '2rem'
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

export const searchContainerStyles: SxProps<Theme> = {
  marginTop: 4,
  marginBottom: 4,
};

export const searchFormStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: 2,
};

export const searchInputStyles: SxProps<Theme> = {
  width: '60%',
  marginRight: 2,
};

export const searchResultsStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: 4,
};

export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
