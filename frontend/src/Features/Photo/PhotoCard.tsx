import { FC, useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton, Chip, Box, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { PhotoCardProps } from '../../types';
import { apiClient } from '../../Services/api';

const PhotoCard: FC<PhotoCardProps> = ({ photo, onLike, onBookmark, currentUserId, onEdit, onDelete }) => {
  const isLiked = currentUserId ? photo.likes.includes(currentUserId) : false;
  const isBookmarked = currentUserId ? photo.bookmarkedBy.includes(currentUserId) : false;
  const [photoUsername, setPhotoUsername] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      if (typeof photo.user === 'string') {
        try {
          const response = await apiClient.get<{ user: { username: string } }>(`/users/${photo.user}`);
          setPhotoUsername(response.user.username);
        } catch (error) {
          console.error('Error fetching user:', error);
          setPhotoUsername('Unknown User');
        }
      } else if (typeof photo.user === 'object' && photo.user.username) {
        setPhotoUsername(photo.user.username);
      }
    };

    fetchUser();
  }, [photo.user]);

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardMedia component="img" height="200" width="200" image={photo.imageUrl} alt={photo.description || 'Photo'} loading="lazy" />
      <CardContent>
        <Typography variant="body1" color="text.secondary">
          {photo.description}
        </Typography>
        {Array.isArray(photo.tags) && photo.tags.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {photo.tags.map((tag: string, index: number) => (
              <Chip key={index} label={tag} size="small" />
            ))}
          </Box>
        )}
        <Typography variant="body2" color="text.secondary">
          @{photoUsername || 'Loading...'}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
      {onEdit && (
          <Button size="small" variant="contained" onClick={() => onEdit(photo._id)}>
            Edit
          </Button>
        )}
        {onDelete && (
          <Button size="small" variant="contained" onClick={() => onDelete(photo._id)}>
            Delete
          </Button>
        )}
        <IconButton aria-label="like" onClick={() => onLike(photo._id)} disabled={!currentUserId}>
          <FavoriteIcon color={isLiked ? 'secondary' : 'action'} />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {photo.likes.length}
        </Typography>
        <IconButton aria-label="bookmark" onClick={() => onBookmark(photo._id)}>
          {isBookmarked ? <Bookmark color="primary" /> : <BookmarkBorder />}
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {photo.bookmarkedBy.length}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default PhotoCard;
