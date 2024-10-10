import { FC } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import PhotoUpload from '../Photo/PhotoUpload';
import UserPhotos from '../User/UserPhotos';

const UploadPage: FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="div" gutterBottom align="center">
        Upload and Manage Your Photos
      </Typography>
      <PhotoUpload />
      <Divider sx={{ my: 4 }} />
      <UserPhotos />
    </Box>
  );
};

export default UploadPage;
