import { useState, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Paper, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { useForm } from '../../Hooks/useForm';
import { UserSnackbar } from '../Photo/Snackbar';
import { FormField } from './FormField';
import { RegisterFormValues } from '../../types';
import { formContainerStyles, formPaperStyles, formStyles } from '../../theme';
import { AlertColor } from '../../types';
import { useAuth } from '../../Contexts/AuthContext';

const Register: FC = () => {
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

  const { register } = useAuth();

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      await register(values.username, values.email, values.password);
      setSnackbar({
        open: true,
        message: 'Registration successful!',
        severity: 'success',
      });
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: 'Registration failed. Please try again.',
        severity: 'error',
      });
    }
  };

  const { values, handleChange, handleSubmit, isLoading } = useForm<RegisterFormValues>({
    initialValues: { username: '', email: '', password: '' },
    onSubmit: handleRegister,
  });

  return (
    <Box sx={{
      ...formContainerStyles,
      margin: '0 auto',
      padding: theme.spacing(2),
    }}>
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
            <PersonAddOutlinedIcon sx={{ fontSize: isMobile ? 30 : 40, mb: 1 }} color="primary" />
            <Typography variant={isMobile ? 'h6' : 'h4'} component="h1" gutterBottom>
              Register
            </Typography>
          </Box>
          <FormField label="Username" name="username" value={values.username} onChange={handleChange} required />
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
            {isLoading ? 'Registering...' : 'Register'}
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

export default Register;