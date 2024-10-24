import { FC, useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton, Chip, Box, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Bookmark, BookmarkBorder, MoreHoriz } from '@mui/icons-material';
import { PhotoCardProps } from '../../types';
import { apiClient } from '../../Services/api';

const PhotoCard: FC<PhotoCardProps> = ({ photo, onLike, onBookmark, currentUserId, onEdit, onDelete }) => {
  const isLiked = currentUserId ? photo.likes.includes(currentUserId) : false;
  const isBookmarked = currentUserId ? photo.bookmarkedBy.includes(currentUserId) : false;
  const [photoUsername, setPhotoUsername] = useState<string | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);
  const maxVisibleTags = 3;

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

  const renderTags = () => {
    if (!Array.isArray(photo.tags) || photo.tags.length === 0) {
      return null;
    }

    const tagsToShow = showAllTags ? photo.tags : photo.tags.slice(0, maxVisibleTags);
    const hasMoreTags = !showAllTags && photo.tags.length > maxVisibleTags;
    return (
      <Box sx={{ 
        mt: 1, 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 0.5,
        minHeight: '32px' // Ensures consistent height whether there are tags or not
      }}>
        {tagsToShow.map((tag: string, index: number) => (
          <Chip
            key={index}
            label={tag}
            size="small"
            sx={{ 
              maxWidth: '120px',
              '& .MuiChip-label': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }
            }}
          />
        ))}
        {hasMoreTags && (
          <IconButton 
            size="small" 
            onClick={() => setShowAllTags(true)}
            sx={{ padding: '2px', height: '24px', width: '24px' }}
          >
            <MoreHoriz fontSize="small" />
          </IconButton>
        )}
      </Box>
    );
  };

  return (
    <Card sx={{ maxWidth: 345, m: 2, display: 'flex', flexDirection: 'column' }}>
      <CardMedia 
        component="img" 
        height="200" 
        image={photo.imageUrl} 
        alt={photo.description || 'Photo'} 
        loading="lazy" 
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          {photo.description}
        </Typography>
        {renderTags()}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          @{photoUsername || 'Loading...'}
        </Typography>
      </CardContent>
      <CardActions sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'flex-start',
        p: 1,
        pt: 0
      }}>
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
        <IconButton 
          aria-label="like" 
          onClick={() => onLike(photo._id)} 
          disabled={!currentUserId}
          size="small"
        >
          <FavoriteIcon color={isLiked ? 'secondary' : 'action'} />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {photo.likes.length}
        </Typography>
        <IconButton 
          aria-label="bookmark" 
          onClick={() => onBookmark(photo._id)}
          size="small"
        >
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
