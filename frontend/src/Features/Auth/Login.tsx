import { useState, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Paper, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useForm } from '../../Hooks/useForm';
import { UserSnackbar } from '../../Features/Photo/Snackbar';
import { FormField } from '../../Features/Auth/FormField';
import { LoginFormValues } from '../../types';
import { formContainerStyles, formPaperStyles, formStyles } from '../../theme';
import { AlertColor } from '../../types';
import { useAuth } from '../../Contexts/AuthContext';

const Login: FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { login } = useAuth();

  const handleLogin = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      setSnackbar({
        open: true,
        message: 'Login successful!',
        severity: 'success',
      });
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: 'Login failed. Please try again.',
        severity: 'error',
      });
    }
  };

  const { values, handleChange, handleSubmit, isLoading } = useForm<LoginFormValues>({
    initialValues: { email: '', password: '' },
    onSubmit: handleLogin,
  });

  return (
    <Box
      sx={{
        ...formContainerStyles,
        margin: '0 auto',
        padding: theme.spacing(2),
      }}
    >
      <Paper
        elevation={3}
        sx={{
          ...formPaperStyles,
          width: '100%',
          maxWidth: isMobile ? '100%' : 400,
        }}
      >
        <Box component="form" onSubmit={handleSubmit} sx={formStyles}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: isMobile ? 30 : 40, mb: 1 }} color="primary" />
            <Typography variant={isMobile ? 'h6' : 'h4'} component="h1" gutterBottom>
              Login
            </Typography>
          </Box>
          <FormField type="email" label="Email" name="email" value={values.email} onChange={handleChange} required />
          <FormField type="password" label="Password" name="password" value={values.password} onChange={handleChange} required />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ mt: 2 }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Paper>
      <UserSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default Login;
