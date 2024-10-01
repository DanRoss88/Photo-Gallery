import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Button, Typography, Box, Paper, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useForm } from '../../Hooks/useForm';
import { Snackbar } from '../../Features/Photo/Snackbar';
import { FormField } from '../../Features/Auth/FormField';
import { apiClientInstance } from '../../Services/api';
import { LoginFormValues } from '../../types';
import { formContainerStyles, formPaperStyles, formStyles } from '../../theme';
import { AuthResponse, AlertColor } from '../../types'

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
        open: false,
        message: '',
        severity: 'success', // Default severity
      });

    const handleLogin = async (values: LoginFormValues) => {
        try {
            const response = await apiClientInstance.post<AuthResponse>('/users/login', values);
            localStorage.setItem('token', response.token);
          setSnackbar({ open: true, message: 'Login successful!', severity: 'success' });
          setTimeout(() => navigate('/'), 1500);
        } catch (err) {
          console.error(err);
          setSnackbar({ open: true, message: 'Login failed. Please try again.', severity: 'error' });
        }
      };
    
      const { values, handleChange, handleSubmit, isLoading } = useForm<LoginFormValues>({
        initialValues: { email: '', password: '' },
        onSubmit: handleLogin,
      });


  return (
    <Box sx={formContainerStyles}>
    <Paper elevation={3} sx={formPaperStyles}>
      <Box component="form" onSubmit={handleSubmit} sx={formStyles}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <LockOutlinedIcon sx={{ fontSize: 40, mb: 1 }} color="primary" />
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>
        </Box>
        <FormField
          type="email"
          label="Email"
          name="email"
          value={values.email}
          onChange={handleChange}
          required
        />
        <FormField
          type="password"
          label="Password"
          name="password"
          value={values.password}
          onChange={handleChange}
          required
        />
            <Button 
            type="submit" 
            variant="contained"
            color="primary" 
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default Login;