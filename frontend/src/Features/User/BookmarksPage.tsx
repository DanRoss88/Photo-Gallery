import { useEffect, useState, useCallback, FC } from 'react';
import { Container, Box, Pagination, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../Contexts/AuthContext';
import { apiClient } from '../../Services/api';
import usePhotoOperations from '../../Hooks/usePhotoOperations';
import usePagination from '../../Hooks/usePagination';
import PhotoCard from '../Photo/PhotoCard';
import { PhotoBookmarkResponse, Photo } from '../../types';
import { ItemsPerPageSelect } from '../Photo/ItemsPerPageSelect';

const BookmarksPage: FC = () => {
  const { user } = useAuth();
  const currentUserId = user ? user._id : null;
  const { page, limit, handlePageChange, handleLimitChange } = usePagination();
  const [totalBookmarks, setTotalBookmarks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { photos, setPhotos, handleLike, handleBookmark } = usePhotoOperations([], currentUserId, true);

  const fetchBookmarks = useCallback(async () => {
    if (!currentUserId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<PhotoBookmarkResponse>(`/photos/${currentUserId}/bookmarks?page=${page}&limit=${limit}`);
      setTotalBookmarks(response.total);
      setPhotos(response.data.data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setError('Failed to fetch bookmarks. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentUserId, page, limit, setPhotos]);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [fetchBookmarks, user]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="div" gutterBottom sx={{ textAlign: 'center', my: 4 }}>
        Your Bookmarks
      </Typography>
      {photos.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h4" component="div" gutterBottom>
            No bookmarks found.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 4,
            py: 4,
          }}
        >
          {photos.map((photo: Photo) => (
            <Box key={photo._id} sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
              <PhotoCard photo={photo} onLike={handleLike} onBookmark={handleBookmark} currentUserId={currentUserId} />
            </Box>
          ))}
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 4,
          flexDirection: 'column',
        }}
      >
        <Pagination count={Math.ceil(totalBookmarks / limit)} page={page} onChange={handlePageChange} color="primary" sx={{ mb: 2 }} />
        <ItemsPerPageSelect value={limit} onChange={handleLimitChange} options={[12, 24, 36]} />
      </Box>
    </Container>
  );
};

export default BookmarksPage;
