import { FC, useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import usePhotoOperations from '../../Hooks/usePhotoOperations';
import PhotoUpload from '../Photo/PhotoUpload';
import UserPhotos from '../User/UserPhotos';
import { useAuth } from '../../Contexts/AuthContext';

const UploadPage: FC = () => {
  const { user } = useAuth();
  const currentUserId = user ? user._id : null;
  const { photos, getUsersPhotos, setPhotos, handleLike, handleBookmark, editPhoto, deletePhoto } = usePhotoOperations([], currentUserId);

  useEffect(() => {
    if (currentUserId) {
      getUsersPhotos();
    }
  }, [getUsersPhotos, currentUserId]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="div" gutterBottom align="center">
        Upload and Manage Your Photos
      </Typography>
      <PhotoUpload setUploadedPhotos={setPhotos} />
      <Divider sx={{ my: 4 }} />
      <UserPhotos
        photos={photos}
        onLike={handleLike}
        onBookmark={handleBookmark}
        onEdit={editPhoto}
        onDelete={deletePhoto}
        currentUserId={currentUserId}
      />
    </Box>
  );
};

export default UploadPage;
