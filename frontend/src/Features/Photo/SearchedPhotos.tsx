import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material';
import { useSearchPhotos } from '../../Hooks/useSearchPhotos';
import PhotoCard from './PhotoCard';
import { useAuth } from '../../Contexts/AuthContext';
import usePhotoOperations from '../../Hooks/usePhotoOperations';

const SearchedPhotos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { searchResults, isSearching, searchError, searchPhotos } = useSearchPhotos();
  const { user } = useAuth();
  const currentUserId = user ? user._id : null;
  const { handleLike, handleBookmark } = usePhotoOperations(searchResults, currentUserId);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchPhotos(searchTerm.trim());
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <form onSubmit={handleSearch}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <TextField
            value={searchTerm}
            onChange={(e: any ) => setSearchTerm(e.target.value)}
            placeholder="Search by tags..."
            variant="outlined"
            sx={{ mr: 2, width: '300px' }}
          />
          <Button type="submit" variant="contained" color="primary">
            Search
          </Button>
        </Box>
      </form>

      {isSearching && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {searchError && (
        <Typography color="error" align="center" sx={{ my: 2 }}>
          {searchError}
        </Typography>
      )}

      {!isSearching && searchResults.length > 0 && (
        <Grid container spacing={4}>
          {searchResults.map((photo) => (
            <Grid item key={photo._id} xs={12} sm={6} md={4}>
              <PhotoCard
                photo={photo}
                onLike={handleLike}
                onBookmark={handleBookmark}
                currentUserId={currentUserId}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {!isSearching && searchResults.length === 0 && searchTerm && (
        <Typography align="center" sx={{ my: 2 }}>
          No photos found for "{searchTerm}".
        </Typography>
      )}
    </Box>
  );
};

export default SearchedPhotos;