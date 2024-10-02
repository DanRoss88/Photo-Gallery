import React, { useEffect, useState, useCallback, FC } from "react";
import { Container, Box, Pagination, Select, MenuItem } from "@mui/material";
import { useAuth } from "../../Contexts/AuthContext";
import { apiClientInstance } from "../../Services/api";
import usePhotoCard from "../../Hooks/usePhotoCard";
import usePagination from "../../Hooks/usePagination";
import PhotoCard from "../Photo/PhotoCard";
import { BookmarkResponse } from "../../types";

const BookmarksPage: FC = () => {
  const { isLoggedIn, user } = useAuth();
  const currentUserId = user ? user._id : null;
  const { page, limit, handlePageChange, handleLimitChange } = usePagination();
  const [totalBookmarks, setTotalBookmarks] = useState(0);
  const { photos, setPhotos, handleLike, handleBookmark } = usePhotoCard(
    [],
    currentUserId,
    isLoggedIn
  );

  const fetchBookmarks = useCallback(async () => {
    if (!currentUserId) return; // Exit if not logged in
    try {
      const response = await apiClientInstance.get<BookmarkResponse>(
        `/users/${currentUserId}/bookmarks?page=${page}&limit=${limit}`
      );
      setTotalBookmarks(response.data.total); // Set total bookmarks
      setPhotos(response.data.bookmarks); // Set bookmarks in photo state
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  }, [currentUserId, page, limit, setPhotos]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchBookmarks();
    }
  }, [fetchBookmarks, isLoggedIn]);

  return (
    <Container maxWidth="lg">
    {photos.length === 0 ? (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        No bookmarks found.
      </Box>
    ) : (
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
          <Box key={photo._id} sx={{ width: { xs: "100%", sm: "45%", md: "30%" } }}>
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
    )}
      <Pagination
        count={Math.ceil((totalBookmarks || 1) / limit)}
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

export default BookmarksPage;
