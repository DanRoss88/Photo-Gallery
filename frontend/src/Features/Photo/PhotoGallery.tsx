import { useState, useEffect, useCallback, FC, SyntheticEvent, FormEvent } from 'react';
import { Container, Box, Paper, Pagination, Typography, Tab, Tabs, CircularProgress } from '@mui/material';
import PhotoCard from './PhotoCard';
import SearchBar from '../Navbar/SearchBar';
import { useSearchPhotos } from '../../Hooks/useSearchPhotos';
import { useAuth } from '../../Contexts/AuthContext';
import { apiClient } from '../../Services/api';
import { PhotoBookmarkResponse, Photo, AlertColor } from '../../types';
import usePhotoOperations from '../../Hooks/usePhotoOperations';
import usePagination from '../../Hooks/usePagination';
import { searchContainerStyles, searchFormStyles, searchResultsStyles } from '../../theme';
import { ItemsPerPageSelect } from './ItemsPerPageSelect';
import { UserSnackbar } from './Snackbar';

const PhotoGallery: FC = () => {
  const { user } = useAuth();
  const currentUserId = user ? user._id : null;
  const { page, limit, handlePageChange, handleLimitChange } = usePagination();
  const { photos, setPhotos, handleLike, handleBookmark } = usePhotoOperations([], currentUserId);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const { searchResults, isSearching, searchError, searchPhotos } = useSearchPhotos();
  const [totalPages, setTotalPages] = useState(1);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const fetchPhotos = useCallback(async () => {
    try {
      const response = await apiClient.get<PhotoBookmarkResponse>(`/photos?page=${page}&limit=${limit}`);
      setPhotos(response?.data?.data ?? []);
      setTotalPages(response?.totalPages ?? 1);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setPhotos([]);
    }
  }, [page, limit, setPhotos]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchPhotos(searchTerm.trim());
      setActiveTab(1);
      if (searchResults.length === 0) {
        setSnackbar({
          open: true,
          message: 'No photos found for your search.',
          severity: 'warning',
        });
      }
    }
  };

  const renderPhotoGrid = (photoList: Photo[]) => (
    <Box sx={searchResultsStyles}>
      {photoList.length > 0 &&
        photoList.map((photo) => <PhotoCard key={photo._id} photo={photo} onLike={handleLike} onBookmark={handleBookmark} currentUserId={currentUserId} />)}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={searchContainerStyles}>
      <Paper elevation={3}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab sx={{ mb: 1, mt: 1 }} label="Gallery" />
          <Tab sx={{ mb: 1, mt: 1 }} label="Search Photos" />
        </Tabs>

        <Box sx={searchFormStyles}>
          <SearchBar handleSearch={handleSearch} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </Box>

        {activeTab === 0 && (
          <>
            {renderPhotoGrid(photos)}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 4,
                flexDirection: 'column',
              }}
            >
              <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" sx={{ mb: 2 }} />
              <ItemsPerPageSelect value={limit} onChange={handleLimitChange} options={[12, 24, 36]} />
            </Box>
          </>
        )}

        {activeTab === 1 && (
          <>
            {isSearching ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : searchError ? (
              <Typography color="error" align="center" sx={{ my: 2 }}>
                {searchError}
              </Typography>
            ) : (
              renderPhotoGrid(searchResults)
            )}
          </>
        )}
      </Paper>
      <UserSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Container>
  );
};

export default PhotoGallery;
