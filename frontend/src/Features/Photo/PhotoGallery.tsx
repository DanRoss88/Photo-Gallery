import React, { useState, useEffect, useContext } from 'react';
import { Container, Box } from '@mui/material';
import PhotoCard from './PhotoCard';
import { AuthContext } from '../../App';
import api from '../../Services/api';

interface Photo {
  _id: string;
  imageUrl: string;
  description: string;
  likes: string[];
  bookmarks: string[];
}

const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const { isLoggedIn } = useContext(AuthContext);


  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const cachedPhotos = localStorage.getItem('cachedPhotos');
        if (cachedPhotos) {
          setPhotos(JSON.parse(cachedPhotos));
        }
         // Fetch fresh data from the API
         const res = await api.get('/photos');
         const fetchedPhotos = res.data;
 
         // Update state with fetched photos
         setPhotos(fetchedPhotos);
 
         // Cache the fetched photos
         localStorage.setItem('cachedPhotos', JSON.stringify(fetchedPhotos));
       } catch (err) {
         console.error('Error fetching photos:', err);
       }
     };
 
     fetchPhotos();
   }, []);
 

   const handleLike = async (id: string) => {
    if (!isLoggedIn) return;
    try {
      await api.put(`/photos/like/${id}`);
      setPhotos(photos.map(photo => 
        photo._id === id ? { ...photo, likes: [...photo.likes, 'currentUserId'] } : photo
      ));
      // Update cache
      localStorage.setItem('cachedPhotos', JSON.stringify(photos));
    } catch (err) {
      console.error('Error liking photo:', err);
    }
  };

  const handleBookmark = async (id: string) => {
    if (!isLoggedIn) return;
    try {
      await api.put(`/photos/bookmark/${id}`);
      setPhotos(photos.map(photo => 
        photo._id === id ? { ...photo, bookmarks: [...photo.bookmarks, 'currentUserId'] } : photo
      ));
      // Update cache
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
            />
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default PhotoGallery;