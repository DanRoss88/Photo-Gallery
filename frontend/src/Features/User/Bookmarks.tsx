import React, { useState, useEffect } from "react";
import { Container, Box, Pagination } from "@mui/material";
import PhotoCard from "../Photo/PhotoCard";
import { useAuth } from "../../Contexts/AuthContext";
import { apiClientInstance } from "../../Services/api";
import { Photo, PhotoResponse } from "../../types";
import  handleLike  from '../Photo/PhotoGallery';
import handleBookmark  from '../Photo/PhotoGallery';



const BookmarksPage: React.FC<{ initialPhotos: Photo[], currentUserId: string | null, isLoggedIn: boolean }> = ({ initialPhotos, currentUserId, isLoggedIn }) => {
    const { photos, handleLike, handleBookmark } = usePhotoCard(initialPhotos, currentUserId, isLoggedIn);
  

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
        {photos.map(photo => (
          <Box key={photo._id} sx={{ width: { xs: "100%", sm: "45%", md: "30%" } }}>
          <PhotoCard
          key={photo._id}
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
        count={Math.ceil(totalBookmarks / limit)}
        page={page}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 4, display: "flex", justifyContent: "center" }}
      />
    </Container>
  );
};

export default BookmarksPage;