import React, { useState, useEffect, useCallback } from "react";
import { Container, Box, Pagination, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import PhotoCard from "./PhotoCard";
import { useAuth } from "../../Contexts/AuthContext";
import { apiClientInstance } from "../../Services/api";
import { Photo, PhotoResponse } from "../../types";

const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const { isLoggedIn, user } = useAuth();
  const currentUserId = user ? user._id : null;


  const fetchPhotos = useCallback(async () => {
    try {
      const fetchedPhotosResponse = await apiClientInstance.get<PhotoResponse>(
        `/photos?page=${page}&limit=${limit}`
      );
      const fetchedPhotos = fetchedPhotosResponse.data.photos;
      setPhotos(fetchedPhotos);
      setTotalPhotos(fetchedPhotosResponse.data.total);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
}, [limit, page]);

    useEffect(() => {
        fetchPhotos();
    }, [fetchPhotos]);

  const handlePageChange = (event: any, value: number) => {
    setPage(value);
  };

  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value as number;  
    setLimit(value);
  };

const handleLike = async (id: string) => {
    if (!isLoggedIn || !currentUserId) return;

    try {
      const photo = photos.find(p => p._id === id);
      if (!photo) return;
  
      const isLiked = photo.likes.includes(currentUserId);
      const response = await apiClientInstance.put<{ message: string, data: { photo: Photo } }>(`/photos/like/${id}`, {
        userId: currentUserId,
        like: !isLiked
      });

      setPhotos(prevPhotos =>
        prevPhotos.map(photo =>
          photo._id === id ? response.data.photo : photo
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

const handleBookmark = async (id: string) => {
    if (!isLoggedIn || !currentUserId) return;
  
    try {
      const photo = photos.find(p => p._id === id);
      if (!photo) return;
  
      const isBookmarked = photo.bookmarks.includes(currentUserId);
      const response = await apiClientInstance.put<{ message: string, data: { photo: Photo } }>(`/photos/bookmark/${id}`, {
        userId: currentUserId, 
        bookmark: !isBookmarked
      });
  
      setPhotos(prevPhotos =>
        prevPhotos.map(photo =>
          photo._id === id ? response.data.photo : photo
        )
      );
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

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
              isLoggedIn={isLoggedIn}
            />
          </Box>
        ))}
      </Box>
    <Pagination
        count={Math.ceil(totalPhotos / limit)}
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
