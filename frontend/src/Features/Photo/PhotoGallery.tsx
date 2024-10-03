import { useEffect, useCallback, FC } from "react";
import {
  Container,
  Box,
  Pagination,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import PhotoCard from "./PhotoCard";
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

  return (
    <Container maxWidth="lg">
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
          <Typography>No photos available</Typography> // Optional: Display a message if no photos exist
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
          <Select value={limit} onChange={handleLimitChange} size="small">
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </Box>
      </Box>
    </Container>
  );
};

export default PhotoGallery;
