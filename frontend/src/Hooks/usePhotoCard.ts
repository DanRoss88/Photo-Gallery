import { useState  } from 'react';
import { apiClientInstance } from '.././Services/api'; // Adjust the import based on your project structure
import { Photo } from '../types'; // Adjust the import based on your project structure

const usePhotoCard = (initialPhotos: Photo[], currentUserId: string | null, isLoggedIn: boolean) => {
    const [photos, setPhotos] = useState<Photo[]>(initialPhotos);

    const handleLike = async (id: string) => {
        console.log(`Attempting to like photo with id: ${id}`);
        if (!isLoggedIn || !currentUserId) return;

        try {
            const photo = photos.find(p => p._id === id);
            if (!photo) return;

            const isLiked = photo.likes.includes(currentUserId);
            console.log(`Photo is currently liked: ${isLiked}`);
            const response = await apiClientInstance.put<{ message: string, data: { photo: Photo } }>(`/photos/like/${id}`, {
                userId: currentUserId,
                like: !isLiked
            });
            console.log(`Like response: ${JSON.stringify(response.data)}`);
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
        console.log(`Attempting to bookmark photo with id: ${id}`);
        if (!isLoggedIn || !currentUserId) return;
      
        try {
          const photo = photos.find((p) => p._id === id);
          if (!photo) return;
      
          const isBookmarked = photo.bookmarks.includes(currentUserId);
          const bookmarkAction = !isBookmarked;
      
          // Toggle bookmark for the photo, relying on cookies for authorization
          const photoResponse = await apiClientInstance.put<{ message: string, data: { photo: Photo } }>(
            `/photos/bookmark/${id}`,
            { bookmark: bookmarkAction }, // Include bookmark toggle
            { withCredentials: true } // Ensure credentials (cookies) are sent
          );
      
          console.log(`Bookmark response: ${JSON.stringify(photoResponse.data)}`);
          
          // Update the photo state
          setPhotos((prevPhotos) =>
            prevPhotos.map((photo) =>
              photo._id === id ? photoResponse.data.photo : photo
            )
          );
        } catch (error) {
          console.error("Error toggling bookmark:", error);
        }
      }; 

    return { photos, setPhotos, handleLike, handleBookmark }; // Return setPhotos here
};

export default usePhotoCard;