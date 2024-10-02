export interface AuthContextType {
    isLoggedIn: boolean;
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
  description?: string;
  likes: string[];
  bookmarks: string[];
}

export interface PhotoResponse {
    status: string;
    results: number;
    data: {
      photos: Photo[]; 
      total: number;
    };
  }

export interface BookmarkResponse {
    status: string;
    results: number;
    data: {
        bookmarks: Photo[];
        total: number;
    };
}  
export interface PhotoCardProps {
  photo: Photo;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  currentUserId: string | null;
  isLoggedIn: boolean;
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

export type AlertColor = 'success' | 'info' | 'warning' | 'error';