export interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export interface Photo {
  _id: string;
  user: string;
  imageUrl: string;
  description?: string;
  likes: string[];
  bookmarks: string[];
}
export interface PhotoCardProps {
    photo: Photo;
    onLike: (id: string) => void;
    onBookmark: (id: string) => void;
    currentUserId: string | null;
    isLoggedIn: boolean;
  }
export interface User{
    _id: string;
}