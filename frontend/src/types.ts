export interface Photo {
    id: string;              
    user: string;
    imageUrl: string;
    description?: string;
    likes: number;
    bookmarks: number;    
  }

export interface PhotoCardProps {
    photo: {
      id: string;
      imageUrl: string;
      description: string;
      likes: number;
      bookmarks: number;
    };
    onLike: (id: string) => void;
    onBookmark: (id: string) => void;
  }