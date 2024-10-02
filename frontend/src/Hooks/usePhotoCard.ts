import { useState  } from 'react';
import { apiClientInstance } from '.././Services/api'; // Adjust the import based on your project structure
import { Photo } from '../types'; // Adjust the import based on your project structure

const usePhotoCard = (initialPhotos: Photo[], currentUserId: string | null, isLoggedIn: boolean) => {
    const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  
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
        const bookmarkAction = !isBookmarked; // Determine the action
  
        // Toggle bookmark for the photo
        const photoResponse = await apiClientInstance.put<{ message: string, data: { photo: Photo } }>(`/photos/bookmark/${id}`, {
          userId: currentUserId,
          bookmark: bookmarkAction
        });
  
        // Update the photo state
        setPhotos(prevPhotos =>
          prevPhotos.map(photo =>
            photo._id === id ? photoResponse.data.photo : photo
          )
        );
  
        // Update the user's bookmarks
        const userResponse = await apiClientInstance.put<{ message: string, data: { user: any } }>(`/users/bookmark/${currentUserId}`, {
          photoId: id,
          bookmark: bookmarkAction
        });
  
        // Optionally handle the user response if needed
        console.log("User bookmarks updated:", userResponse.data.user.bookmarks);
  
      } catch (error) {
        console.error("Error toggling bookmark:", error);
      }
    };
  
    return { photos, handleLike, handleBookmark };
  };
  
  export default usePhotoCard;