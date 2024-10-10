import { apiClient } from './api';
import { Photo, PhotoBookmarkResponse, TogglePhotoResponse } from '../types';

export const photoService = {
  getPhotos: async (page: number, limit: number): Promise<PhotoBookmarkResponse> => {
    return apiClient.get(`/photos?page=${page}&limit=${limit}`);
  },
  togglePhotoOperation: async (photoId: string, operation: 'like' | 'bookmark', userId: string, likeStatus?: boolean): Promise<TogglePhotoResponse> => {
    const endpoint = operation === 'like' ? 'like' : 'bookmark';
    return apiClient.put(`/photos/${endpoint}/${photoId}`, {
      userId,
      ...(operation === 'like' && { like: likeStatus }),
    });
  },
  searchPhotos: async (query: string): Promise<{ data: Photo[] }> => {
    return apiClient.get(`/photos/search?query=${encodeURIComponent(query)}`);
  },

  getUserPhotos: async (): Promise<{ photos: Photo[] }> => {
    return apiClient.get('/photos/user');
  },

  updatePhotoDetails: async (photoId: string, data: { description: string; tags: string[] }): Promise<{ photo: Photo }> => {
    return apiClient.put(`/photos/${photoId}`, data);
  },

  deletePhoto: async (photoId: string): Promise<void> => {
    return apiClient.delete(`/photos/${photoId}`);
  },

  uploadPhoto: async (formData: FormData): Promise<Photo> => {
    return apiClient.post('/photos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
