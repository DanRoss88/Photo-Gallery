import { useState, useCallback, ChangeEvent, FC } from 'react';
import { Button, TextField, Typography, Box, Paper, CircularProgress, Chip } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import { apiClient } from '../../Services/api';
import { UserSnackbar } from './Snackbar';
import { useForm } from '../../Hooks/useForm';
import { AlertColor, Photo, PhotoUploadFormValues } from '../../types';
import { VisuallyHiddenInput } from '../../theme';

const PhotoUpload: FC<{ setUploadedPhotos: (photos: Photo[]) => void }> = ({ setUploadedPhotos }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({ open: false, message: '', severity: 'success' });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const handleUpload = async (values: PhotoUploadFormValues) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('description', values.description);
    const tagsString = tags.join(', ');
    formData.append('tags', tagsString);

    try {
      const response = await apiClient.post<{ data: Photo[]}>('/photos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (!response) {
        console.log('Error uploading photo');
        return;
      }
      setUploadedPhotos(response.data);
      setFile(null);
      setTags([]);
      setPreviewUrl(null);
      setSnackbar({
        open: true,
        message: 'Photo uploaded successfully!',
        severity: 'success',
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: 'Failed to upload photo. Please try again.',
        severity: 'error',
      });
    }
  };

  const { values, handleChange, handleSubmit, isLoading } = useForm<PhotoUploadFormValues>({
    initialValues: { description: '', tags: [] },
    onSubmit: handleUpload,
  });

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags((prev) => [...prev, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  return (
    <Paper
    elevation={3}
    sx={{
      p: 4,
      maxWidth: 500,
      mx: 'auto',
      mt: 4,
      boxShadow: '0px 4px 20px rgba(255, 255, 255, 0.6), 0px 4px 10px rgba(0, 0, 0, 0.1)',
    }}
  >
    <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
      Upload Photo
    </Typography>
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Button component="label" variant="outlined" startIcon={file ? <ImageIcon /> : <CloudUploadIcon />} sx={{ mb: 2 }}>
        {file ? 'Change Photo' : 'Upload Photo'}
        <VisuallyHiddenInput type="file" onChange={handleFileChange} accept="image/*" />
      </Button>
      {previewUrl && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} />
        </Box>
      )}
      {file && (
        <Typography variant="body2" align="center">
          Selected file: {file.name}
        </Typography>
      )}
      <TextField fullWidth multiline rows={4} label="Description" name="description" value={values.description} onChange={handleChange} />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Add Tag"
          value={tagInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
          sx={{ flexGrow: 1, marginRight: '8px' }}
        />
        <Button variant="contained" onClick={handleAddTag}>
          Add
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
        {tags.map((tag: string) => (
          <Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} sx={{ margin: '4px' }} />
        ))}
      </Box>
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
    <UserSnackbar
      open={snackbar.open}
      message={snackbar.message}
      severity={snackbar.severity}
      onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
    />
  </Paper>
);
};

export default PhotoUpload;
