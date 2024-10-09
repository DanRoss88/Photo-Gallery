import { useEffect, useState, FC, ChangeEvent } from 'react';
import { 
  Box, 
  Typography,  
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  Container, 
  Button, 
  TextField, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { apiClientInstance } from '../../Services/api';
import { Photo } from '../../types';

const UserPhotos: FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
    const [editDescription, setEditDescription] = useState<string>('');
    const [editTags, setEditTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');


    useEffect(() => {
      fetchUserPhotos();
    }, []);
  
    const fetchUserPhotos = async () => {
      try {
        const response = await apiClientInstance.get<{ data: { photos: Photo[] } }>('/photos/user');
        setPhotos(response.data.photos);
      } catch (error) {
        console.error('Error fetching user photos:', error);
      }
    };
  
    const handleEdit = (photo: Photo) => {
      setEditingPhoto(photo);
      setEditDescription(photo.description || '');
      setEditTags(Array.isArray(photo.tags) ? photo.tags : []);
    };
  
    const handleSave = async () => {
      if (!editingPhoto) return;
  
      try {
        const response = await apiClientInstance.put<{ data: { photo: Photo } }>(`/photos/${editingPhoto._id}`, {
          description: editDescription,
          tags: editTags,
        });
  
        setPhotos(photos.map(photo => 
          photo._id === editingPhoto._id ? response.data.photo : photo
        ));
  
        setEditingPhoto(null);
      } catch (error) {
        console.error('Error updating photo:', error);
      }
    };
  
    const handleDelete = async (photoId: string) => {
      try {
        await apiClientInstance.delete(`/photos/${photoId}`);
        setPhotos(photos.filter(photo => photo._id !== photoId));
      } catch (error) {
        console.error('Error deleting photo:', error);
      }
    };
  
    const handleAddTag = () => {
      if (newTag && !editTags.includes(newTag)) {
        setEditTags([...editTags, newTag]);
        setNewTag('');
      }
    };
  
    const handleRemoveTag = (tagToRemove: string) => {
      setEditTags(editTags.filter(tag => tag !== tagToRemove));
    };
  
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center'}}>
        <Typography variant='h4' component="div" mb="4rem">Your Photos</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {photos.map(photo => (
            <Box key={photo._id} sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={photo.imageUrl}
                  alt={photo.description || 'User photo'}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {photo.description}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {Array.isArray(photo.tags) && photo.tags.map((tag: string, index: number) => (
                      <Chip key={index} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5, typography: "body2", }} />
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between"}} >
                  <Button size="small" variant="contained" onClick={() => handleEdit(photo)}>Edit</Button>
                  <Button size="small" variant="contained" onClick={() => handleDelete(photo._id)}>Delete</Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
  
        <Dialog open={!!editingPhoto} onClose={() => setEditingPhoto(null)}>
          <DialogTitle>Edit Photo</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              label="Description"
              fullWidth
              variant="standard"
              value={editDescription}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEditDescription(e.target.value)}
            />
            <Box sx={{ mt: 2 }}>
              {editTags.map((tag: string, index: number) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  onDelete={() => handleRemoveTag(tag)} 
                  sx={{ mr: 0.5, mb: 0.5 }} 
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', mt: 2 }}>
              <TextField
                label="Add new tag"
                variant="standard"
                value={newTag}
                onChange={(e: any) => setNewTag(e.target.value)}
              />
              <Button onClick={handleAddTag}>Add</Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingPhoto(null)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  };
  
  export default UserPhotos;