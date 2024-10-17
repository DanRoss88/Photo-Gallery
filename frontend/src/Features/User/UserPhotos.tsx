import { useState, FC, ChangeEvent } from 'react';
import { Box, Typography, Container, Button, TextField, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Photo } from '../../types';
import PhotoCard from '../Photo/PhotoCard';

interface UserPhotosProps {
  photos: Photo[];
  onLike: (photoId: string) => void;
  onBookmark: (photoId: string) => void;
  onEdit: (photoId: string, updatedData: { description: string; tags: string[] }) => void;
  onDelete: (photoId: string) => void;
  currentUserId: string | null;
}

const UserPhotos: FC<UserPhotosProps> = ({ photos, onLike, onBookmark, onEdit, onDelete, currentUserId }) => {
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [editDescription, setEditDescription] = useState<string>('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
 
  const handleEdit = (photo: Photo) => {
    setEditingPhoto(photo);
    setEditDescription(photo.description || '');
    setEditTags(Array.isArray(photo.tags) ? photo.tags : []);
  };

  const handleSave = async () => {
    if (!editingPhoto) return;

    onEdit(editingPhoto._id, {
      description: editDescription,
      tags: editTags,
    });
    setEditingPhoto(null);
  };

  const handleAddTag = () => {
    if (newTag && !editTags.includes(newTag)) {
      setEditTags([...editTags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      {photos.length > 0 && <Typography variant="h4" component="div" mb="4rem">
          Your Photos
        </Typography>}
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {photos.map((photo) => (
          <Box key={photo._id} sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
          <PhotoCard
            key={photo._id}
            photo={photo}
            currentUserId={currentUserId}
            onLike={onLike}
            onBookmark={onBookmark}
            onEdit={() => handleEdit(photo)}
            onDelete={() => onDelete(photo._id)}
          />
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
              <Chip key={index} label={tag} onDelete={() => handleRemoveTag(tag)} sx={{ mr: 0.5, mb: 0.5 }} />
            ))}
          </Box>
          <Box sx={{ display: 'flex', mt: 2 }}>
            <TextField label="Add new tag" variant="standard" value={newTag} onChange={(e: any) => setNewTag(e.target.value)} />
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
