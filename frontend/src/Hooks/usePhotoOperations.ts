import { useState, useCallback } from "react";
import { apiClientInstance } from "../Services/api"; // Adjust the import based on your project structure
import { User, Photo } from "../types";

const usePhotoOperations = (initialPhotos: Photo[], currentUserId: string | null) => {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);

  const updatePhotoInState = useCallback((updatedPhoto: Photo) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) => (photo._id === updatedPhoto._id ? updatedPhoto : photo))
    );
  }, []);

  const handlePhotoOperation = useCallback(
    async (photoId: string, operation: 'like' | 'bookmark') => {
      if (!currentUserId) return;

      try {
        const photo = photos.find((p) => p._id === photoId);
        if (!photo) return;

        const isOperationActive = photo[`${operation}s`].includes(currentUserId);
        const endpoint = operation === 'like' ? 'like' : 'bookmark';

        const response = await apiClientInstance.put<{
          message: string;
          data: { photo: Photo; user: User };
        }>(
          `/photos/${endpoint}/${photoId}`,
          { [operation]: !isOperationActive },
          { withCredentials: true }
        );

        updatePhotoInState(response.data.photo);

        return response.data;
      } catch (error) {
        console.error(`Error toggling ${operation}:`, error);
      }
    },
    [photos, currentUserId, updatePhotoInState]
  );

  const handleLike = useCallback(
    (photoId: string) => handlePhotoOperation(photoId, 'like'),
    [handlePhotoOperation]
  );

  const handleBookmark = useCallback(
    (photoId: string) => handlePhotoOperation(photoId, 'bookmark'),
    [handlePhotoOperation]
  );

  return { photos, setPhotos, handleLike, handleBookmark, updatePhotoInState };
};

export default usePhotoOperations;
