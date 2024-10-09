import { useState, useCallback } from 'react';
import { apiClientInstance } from '../Services/api';
import { Photo } from '../types';

export const useSearchPhotos = () => {
  const [searchResults, setSearchResults] = useState<Photo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchPhotos = useCallback(async (query: string) => {
    setIsSearching(true);
    setSearchError(null);
    try {
      const response = await apiClientInstance.get<{ data: { data: Photo[] } }>(`/photos/search?query=${query}`);
      setSearchResults(response.data.data);
    } catch (error) {
      console.error('Error searching photos:', error);
      setSearchError('Failed to search photos. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  return { searchResults, isSearching, searchError, searchPhotos };
};