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
  user: string;
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
