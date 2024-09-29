import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../../Services/api';

const PhotoUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('description', description);

    try {
      await api.post('/photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFile(null);
      setDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Upload Photo
      </Typography>
      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{ mb: 2 }}
      >
        Choose File
        <input
          type="file"
          hidden
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
      </Button>
      {file && <Typography variant="body2" sx={{ mb: 2 }}>{file.name}</Typography>}
      <TextField
        fullWidth
        margin="normal"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={3}
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Upload
      </Button>
    </Box>
  );
};

export default PhotoUpload;