import React, { useState, useCallback } from 'react';
import { Button, TextField, Typography, Box, Paper, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import { apiClientInstance }from '../../Services/api';
import { styled } from '@mui/material/styles';
import { Snackbar } from './Snackbar';
import { useForm } from '../../Hooks/useForm';
import { AlertColor } from '../../types';

const VisuallyHiddenInput = styled('input')({
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

  interface PhotoUploadFormValues {
  description: string;
}
  
const PhotoUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
        open: false,
        message: '',
        severity: 'success', // Default severity
      });
  
    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setFile(event.target.files[0]);
      }
    }, []);
  
    const handleUpload = async (values: PhotoUploadFormValues) => {
      if (!file) return;
  
      const formData = new FormData();
      formData.append('image', file);
      formData.append('description', values.description);
  
      try {
        await apiClientInstance.post('/photos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setFile(null);
        setSnackbar({ open: true, message: 'Photo uploaded successfully!', severity: 'success' });
      } catch (err) {
        console.error(err);
        setSnackbar({ open: true, message: 'Failed to upload photo. Please try again.', severity: 'error' });
      }
    };
  
    const { values, handleChange, handleSubmit, isLoading } = useForm<PhotoUploadFormValues>({
      initialValues: { description: '' },
      onSubmit: handleUpload,
    });
  
    return (
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Upload Photo
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={file ? <ImageIcon /> : <CloudUploadIcon />}
            sx={{ mb: 2 }}
          >
            {file ? 'Change Photo' : 'Upload Photo'}
            <VisuallyHiddenInput type="file" onChange={handleFileChange} accept="image/*" />
          </Button>
          {file && (
            <Typography variant="body2" align="center">
              Selected file: {file.name}
            </Typography>
          )}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            name="description"
            value={values.description}
            onChange={handleChange}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!file || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </Box>
        <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      />
    </Paper>
  );
};

export default PhotoUpload;