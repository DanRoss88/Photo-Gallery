import {
  useState,
  useEffect,
  useCallback,
  FC,
  SyntheticEvent,
  FormEvent,
} from "react";
import {
  Container,
  Box,
  Paper,
  Pagination,
  Select,
  MenuItem,
  Typography,
  Tab,
  Tabs,
  CircularProgress,
} from "@mui/material";
import PhotoCard from "./PhotoCard";
import SearchBar from "../Navbar/SearchBar";
import { useSearchPhotos } from "../../Hooks/useSearchPhotos";
import { useAuth } from "../../Contexts/AuthContext";
import { apiClientInstance } from "../../Services/api";
import { PhotoBookmarkResponse, Photo } from "../../types";
import usePhotoOperations from "../../Hooks/usePhotoOperations";
import usePagination from "../../Hooks/usePagination";
import {
  searchContainerStyles,
  searchFormStyles,
  searchResultsStyles,
} from "../../theme";

const PhotoGallery: FC = () => {
  const { user } = useAuth();
  const currentUserId = user ? user._id : null;
  const { page, limit, handlePageChange, handleLimitChange } = usePagination();
  const { photos, setPhotos, handleLike, handleBookmark } = usePhotoOperations(
    [],
    currentUserId
  );
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const { searchResults, isSearching, searchError, searchPhotos } =
    useSearchPhotos();

  const fetchPhotos = useCallback(async () => {
    try {
      const response = await apiClientInstance.get<PhotoBookmarkResponse>(
        `/photos?page=${page}&limit=${limit}`
      );
      setPhotos(response?.data?.data ?? []);
    } catch (error) {
      console.error("Error fetching photos:", error);
      setPhotos([]);
    }
  }, [page, limit, setPhotos]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchPhotos(searchTerm.trim());
      setActiveTab(1);
    }
  };

  const renderPhotoGrid = (photoList: Photo[]) => (
    <Box sx={searchResultsStyles}>
      {photoList.length > 0 ? (
        photoList.map((photo) => (
          <PhotoCard
            key={photo._id}
            photo={photo}
            onLike={handleLike}
            onBookmark={handleBookmark}
            currentUserId={currentUserId}
          />
        ))
      ) : (
        <Typography>No photos available</Typography>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={searchContainerStyles}>
      <Paper elevation={3}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Gallery" />
          <Tab label="Search Results" />
        </Tabs>

        <Box sx={searchFormStyles}>
          <SearchBar
            handleSearch={handleSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </Box>

        {activeTab === 0 && (
          <>
            {renderPhotoGrid(photos)}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 4,
                flexDirection: "column",
              }}
            >
              <Pagination
                count={Math.ceil((photos.length || 1) / limit)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  Items per page:
                </Typography>
                <Select value={limit} onChange={handleLimitChange}>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </Box>
            </Box>
          </>
        )}

        {activeTab === 1 && (
          <>
            {isSearching ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress />
              </Box>
            ) : searchError ? (
              <Typography color="error" align="center" sx={{ my: 2 }}>
                {searchError}
              </Typography>
            ) : (
              renderPhotoGrid(searchResults)
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default PhotoGallery;
