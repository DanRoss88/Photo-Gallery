import React, { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import PhotoCard from './PhotoCard';
import { useAuth } from '../../Contexts/AuthContext';
import { apiClientInstance } from '../../Services/api';
import { Photo, PhotoResponse } from '../../types';

const PhotoGallery: React.FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const { isLoggedIn, user } = useAuth();
    const currentUserId = user ? user._id : null;
  
    const fetchPhotos = async () => {
        try {
          const fetchedPhotosResponse = await apiClientInstance.get<PhotoResponse>('/photos');
          const fetchedPhotos = fetchedPhotosResponse.data.photos;
  
          console.log("Fetched photos:", fetchedPhotos);
          
          if (!Array.isArray(fetchedPhotos)) {
            console.error("Fetched photos is not an array:", fetchedPhotosResponse.data);
            return; 
          }
  
          setPhotos(fetchedPhotos);
        } catch (error) {
          console.error("Error fetching photos:", error);
        }
      };
      useEffect(() => {
        fetchPhotos();
      }, []); 
  
    const handleLike = async (id: string) => {
      if (!isLoggedIn || !currentUserId) return;
      try {
        await apiClientInstance.put(`/photos/like/${id}`, {});
        setPhotos(prevPhotos =>
          prevPhotos.map(photo =>
            photo._id === id ? { ...photo, likes: [...photo.likes, currentUserId] } : photo
          )
        );
        localStorage.setItem('cachedPhotos', JSON.stringify(photos));
      } catch (err) {
        console.error('Error liking photo:', err);
      }
    };
  
    const handleBookmark = async (id: string) => {
      if (!isLoggedIn || !currentUserId) return;
      try {
        await apiClientInstance.put(`/photos/bookmark/${id}`, {});
        setPhotos(prevPhotos =>
          prevPhotos.map(photo =>
            photo._id === id ? { ...photo, bookmarks: [...photo.bookmarks, currentUserId] } : photo
          )
        );
        localStorage.setItem('cachedPhotos', JSON.stringify(photos));
      } catch (err) {
        console.error('Error bookmarking photo:', err);
      }
    };
    
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 4,
            py: 4,
          }}
        >
          {photos.map((photo) => (
            <Box key={photo._id} sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
              <PhotoCard
                photo={photo}
                onLike={handleLike}
                onBookmark={handleBookmark}
                currentUserId={currentUserId}
                isLoggedIn={isLoggedIn}
              />
            </Box>
          ))}
        </Box>
      </Container>
    );
};

export default PhotoGallery;