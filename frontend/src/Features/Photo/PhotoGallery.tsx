import React, { useState, useEffect, useCallback, FC } from "react";
import { Container, Box, Pagination, Select, MenuItem } from "@mui/material";
import PhotoCard from "./PhotoCard";
import { useAuth } from "../../Contexts/AuthContext";
import { apiClientInstance } from "../../Services/api";
import { PhotoResponse } from "../../types";
import usePhotoCard from "../../Hooks/usePhotoOperations";
import usePagination from "../../Hooks/usePagination";

const PhotoGallery: FC = () => {
  const { user } = useAuth();
  const currentUserId = user ? user._id : null;
  const { page, limit, handlePageChange, handleLimitChange } = usePagination();
  const [totalPhotos, setTotalPhotos] = useState(0);
  const { photos, setPhotos, handleLike, handleBookmark } = usePhotoCard(
    [],
    currentUserId
  );

  const fetchPhotos = useCallback(async () => {
    try {
      const fetchedPhotosResponse = await apiClientInstance.get<PhotoResponse>(
        `/photos?page=${page}&limit=${limit}`
      );
      const fetchedPhotos = fetchedPhotosResponse.data.photos;
      setTotalPhotos(fetchedPhotosResponse.data.total);
      setPhotos(fetchedPhotos);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  }, [limit, page, setPhotos]);

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
        {photos.map((photo) => (
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
        ))}
      </Box>
      <Pagination
        count={Math.ceil((totalPhotos || 1) / limit)}
        page={page}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 4, display: "flex", justifyContent: "center" }}
      />
      <Select value={limit} onChange={handleLimitChange} sx={{ mt: 2 }}>
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={20}>20</MenuItem>
        <MenuItem value={50}>50</MenuItem>
      </Select>
    </Container>
  );
};

export default PhotoGallery;
