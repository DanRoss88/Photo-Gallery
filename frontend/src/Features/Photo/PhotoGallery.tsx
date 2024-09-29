import React, { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, CardContent, CardActions, Typography, IconButton } from '@mui/material';
import { Favorite, Bookmark } from '@mui/icons-material';
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

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await api.get('/photos');
        setPhotos(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPhotos();
  }, []);

  const handleLike = async (id: string) => {
    try {
      await api.put(`/photos/like/${id}`);
      setPhotos(photos.map(photo => 
        photo._id === id ? { ...photo, likes: [...photo.likes, 'currentUserId'] } : photo
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmark = async (id: string) => {
    try {
      await api.put(`/photos/bookmark/${id}`);
      setPhotos(photos.map(photo => 
        photo._id === id ? { ...photo, bookmarks: [...photo.bookmarks, 'currentUserId'] } : photo
      ));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Grid container spacing={4}>
      {photos.map((photo) => (
        <Grid item xs={12} sm={6} md={4} key={photo._id}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={`http://localhost:5000${photo.imageUrl}`}
              alt={photo.description}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {photo.description}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton aria-label="like" onClick={() => handleLike(photo._id)}>
                <Favorite color={photo.likes.includes('currentUserId') ? 'secondary' : 'action'} />
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                {photo.likes.length}
              </Typography>
              <IconButton aria-label="bookmark" onClick={() => handleBookmark(photo._id)}>
                <Bookmark color={photo.bookmarks.includes('currentUserId') ? 'primary' : 'action'} />
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                {photo.bookmarks.length}
              </Typography>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PhotoGallery;