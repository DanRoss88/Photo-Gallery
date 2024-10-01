import React from 'react';
import { Snackbar as MuiSnackbar, Alert, AlertColor } from '@mui/material';

interface SnackbarProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
}

export const Snackbar: React.FC<SnackbarProps> = ({ open, message, severity, onClose }) => (
  <MuiSnackbar open={open} autoHideDuration={6000} onClose={onClose}>
    <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
      {message}
    </Alert>
  </MuiSnackbar>
);