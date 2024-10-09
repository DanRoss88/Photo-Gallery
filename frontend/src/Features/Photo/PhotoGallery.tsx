import { useState, useEffect, useCallback, FC, SyntheticEvent } from "react";
import {
  Container,
  Box,
  Paper,
  Pagination,
  Select,
  MenuItem,
  Typography,
  Tab,
  Tabs
} from "@mui/material";
import PhotoCard from "./PhotoCard";
import SearchedPhotos from "./SearchedPhotos";
import { useAuth } from "../../Contexts/AuthContext";
import { apiClientInstance } from "../../Services/api";
import { PhotoBookmarkResponse } from "../../types";
import usePhotoOperations from "../../Hooks/usePhotoOperations";
import usePagination from "../../Hooks/usePagination";

const PhotoGallery: FC = () => {
  const { user } = useAuth();
  const currentUserId = user ? user._id : null;
  const { page, limit, handlePageChange, handleLimitChange } = usePagination();
  const {
    photos = [],
    setPhotos,
    handleLike,
    handleBookmark,
  } = usePhotoOperations([], currentUserId);
  const [activeTab, setActiveTab] = useState(0);

  const fetchPhotos = useCallback(async () => {
    try {
      const response = await apiClientInstance.get<PhotoBookmarkResponse>(
        `/photos?page=${page}&limit=${limit}`
      );
      setPhotos(response?.data?.data ?? []);
    } catch (error) {
      console.error("Error fetching photos:", error);
      setPhotos([]);
    }
  }, [page, limit, setPhotos]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={searchContainerStyles}>
    <Paper elevation={3}>
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Search" />
        <Tab label="Results" />
      </Tabs>

      {activeTab === 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 4,
              py: 4,
            }}
          >
            {photos?.length > 0 ? (
              photos.map((photo) => (
                <Box
                  key={photo._id}
                  sx={{ width: { xs: "100%", sm: "45%", md: "30%" } }}
                >
                  <PhotoCard
                    photo={photo}
                    onLike={handleLike}
                    onBookmark={handleBookmark}
                    currentUserId={currentUserId}
                  />
                </Box>
              ))
            ) : (
              <Typography>No photos available</Typography>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 4,
              flexDirection: "column",
            }}
          >
            <Pagination
              count={Math.ceil((photos.length || 1) / limit)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Items per page:
              </Typography>
              <Select value={limit} onChange={handleLimitChange}>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </Box>
          </Box>
        </>
      )}

      {activeTab === 1 && <SearchedPhotos />}
    </Container>
  );
};

export default PhotoGallery;