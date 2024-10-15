import { useState, useCallback } from 'react';
import { apiClient } from '../Services/api'; // Adjust the import based on your project structure
import { TogglePhotoResponse, Photo } from '../types';

export const usePhotoOperations = (initialPhotos: Photo[], currentUserId: string | null, isBookmarksPage = false) => {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);

  const updatePhotoInState = useCallback((updatedPhoto: Photo) => {
    setPhotos((prevPhotos) => prevPhotos.map((photo) => (photo._id === updatedPhoto._id ? updatedPhoto : photo)));
  }, []);

  const removePhotoFromState = useCallback((photoId: string) => {
    setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo._id !== photoId));
  }, []);

  const getPhotos = useCallback(async () => {
    try {
      const response = await apiClient.get<{ data: Photo[] }>('/photos');
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  }, []);

  const getUsersPhotos = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const response = await apiClient.get<{ data: { photos: Photo[] } }>('/photos/user');
      setPhotos(response.data.photos);
    } catch (error) {
      console.error('Error fetching user photos:', error);
    }
  }, [currentUserId]);

  // Edit a photo's details (description, tags, etc.)
  const editPhoto = useCallback(
    async (photoId: string, updatedData: { description: string; tags: string[] }) => {
      try {
        const response = await apiClient.put<{ data: { photo: Photo } }>(`/photos/${photoId}`, updatedData);
        if (response.data && response.data.photo) {
          updatePhotoInState(response.data.photo);
        }
      } catch (error) {
        console.error('Error editing photo:', error);
      }
    },
    [updatePhotoInState]
  );

  // Delete a photo (DELETE)
  const deletePhoto = useCallback(
    async (photoId: string) => {
      try {
        await apiClient.delete(`/photos/${photoId}`);
        removePhotoFromState(photoId);
      } catch (error) {
        console.error('Error deleting photo:', error);
      }
    },
    [removePhotoFromState]
  );

  const handlePhotoOperation = useCallback(
    async (photoId: string, operation: 'like' | 'bookmark') => {
      if (!currentUserId) return;

      try {
        const endpoint = operation === 'like' ? 'like' : 'bookmark';

        const isLikeOperation = operation === 'like';
        const likeStatus = isLikeOperation ? !photos.find((photo) => photo._id === photoId)?.likes.includes(currentUserId) : undefined;

        const response = await apiClient.put<TogglePhotoResponse>(
          `/photos/${endpoint}/${photoId}`,
          {
            userId: currentUserId,
            ...(isLikeOperation && { like: likeStatus }),
          },
          { withCredentials: true }
        );

        if (response.data && response.data.photo) {
          const updatedPhoto = response.data.photo;

          if (operation === 'bookmark' && !updatedPhoto.bookmarkedBy.includes(currentUserId)) {
            // If unbookmarking and we're on the bookmarks page, remove it from state
            if (isBookmarksPage) {
              removePhotoFromState(photoId);
            }
          } else {
            updatePhotoInState(updatedPhoto);
          }
        }

        return response.data;
      } catch (error) {
        console.error(`Error toggling ${operation}:`, error);
      }
    },
    [currentUserId, updatePhotoInState, removePhotoFromState, isBookmarksPage, photos]
  );

  const handleLike = useCallback((photoId: string) => handlePhotoOperation(photoId, 'like'), [handlePhotoOperation]);

  const handleBookmark = useCallback((photoId: string) => handlePhotoOperation(photoId, 'bookmark'), [handlePhotoOperation]);

  return {
    photos,
    getUsersPhotos,
    setPhotos,
    handleLike,
    handleBookmark,
    getPhotos,
    editPhoto,
    deletePhoto,
  };
};

export default usePhotoOperations;
