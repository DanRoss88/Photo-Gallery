import React, { useState, useCallback } from 'react';
import { Button, TextField, Typography, Box, Paper, CircularProgress, Snackbar, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import api from '../../Services/api';
import { styled } from '@mui/material/styles';

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
  
  const PhotoUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
      open: false,
      message: '',
      severity: 'success'
    });
  
    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setFile(event.target.files[0]);
      }
    }, []);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!file) return;
  
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('description', description);
  
      try {
        await api.post('/photos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setFile(null);
        setDescription('');
        setSnackbar({ open: true, message: 'Photo uploaded successfully!', severity: 'success' });
      } catch (err) {
        console.error(err);
        setSnackbar({ open: true, message: 'Failed to upload photo. Please try again.', severity: 'error' });
      } finally {
        setIsUploading(false);
      }
    };
  
    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setSnackbar({ ...snackbar, open: false });
    };
  
    return (
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Upload Photo
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={file ? <ImageIcon /> : <CloudUploadIcon />}
            sx={{ height: 100, borderStyle: 'dashed' }}
          >
            {file ? file.name : 'Choose File'}
            <VisuallyHiddenInput type="file" onChange={handleFileChange} accept="image/*" required />
          </Button>
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            variant="outlined"
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={isUploading || !file}
            startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </Box>
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    );
  };
  
  export default PhotoUpload;