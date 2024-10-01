import React, { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import PhotoCard from './PhotoCard';
import { useAuth } from '../../Contexts/AuthContext';
import { apiClientInstance } from '../../Services/api';
import { Photo } from '../../types';

const PhotoGallery: React.FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const { isLoggedIn, user } = useAuth();
    const currentUserId = user ? user._id : null;
  
    useEffect(() => {
      const fetchPhotos = async () => {
        try {
          const cachedPhotos = localStorage.getItem('cachedPhotos');
          if (cachedPhotos) {
            const parsedPhotos = JSON.parse(cachedPhotos);
            if (Array.isArray(parsedPhotos)) {
              setPhotos(parsedPhotos);
            }
          }

          // Fetch photos from the API
          const fetchedPhotos = await apiClientInstance.get<Photo[]>('/photos');
         // Access the photos array

          // Ensure fetchedPhotos is an array
          if (Array.isArray(fetchedPhotos)) {
            setPhotos(fetchedPhotos);
            localStorage.setItem('cachedPhotos', JSON.stringify(fetchedPhotos));
          } else {
            console.error('Fetched photos is not an array:', fetchedPhotos);
            setPhotos([]); // Reset to empty array if not an array
          }
        } catch (err) {
          console.error('Error fetching photos:', err);
          setPhotos([]); // Reset to empty array on error
        }
      };
  
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