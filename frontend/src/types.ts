export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (username: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Photo {
  _id: string;
  user: string | { _id: string; username: string };
  imageUrl: string;
  tags?: string[];
  description?: string;
  likes: string[];
  bookmarkedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PhotoBookmarkResponse {
  status: string;
  results: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: {
    data: Photo[];
  };
}

export interface TogglePhotoResponse {
  status: string;
  data: {
    photo: Photo;
    isBookmarked?: boolean;
  };
}

export interface PhotoCardProps {
  photo: Photo;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  currentUserId: string | null;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export interface PhotoUploadFormValues {
  description: string;
  tags: string[];
}
export interface User {
  _id: string;
  email: string;
  username: string;
}

export interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
}
export interface LoginFormValues {
  email: string;
  password: string;
}
export interface User {
  _id: string;
  username: string;
  email: string;
}

export type AlertColor = 'success' | 'info' | 'warning' | 'error';
