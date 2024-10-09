import { useState, useCallback, ChangeEvent, FC } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Chip
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import { apiClientInstance } from "../../Services/api";
import { styled } from "@mui/material/styles";
import { UserSnackbar } from "./Snackbar";
import { useForm } from "../../Hooks/useForm";
import { AlertColor, Photo } from "../../types";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface PhotoUploadFormValues {
  description: string;
  tags: string[];
}

const PhotoUpload: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "success", // Default severity
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [uploadedPhotos, setUploadedPhotos] = useState<Photo[]>([]);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setFile(event.target.files[0]);
      }
    },
    []
  );

  const handleUpload = async (values: PhotoUploadFormValues) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("description", values.description);
    tags.forEach(tag => {
        formData.append("tags[]", tag);
      });

    try {
      const response = await apiClientInstance.post<Photo>(
        "/photos/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (!response) {
        console.log("Error uploading photo");
        return;
      }
      setUploadedPhotoUrl(response.imageUrl);
      setUploadedPhotos((prev) => [...prev, response]);
      setFile(null);
      setTags([]);
      setSnackbar({
        open: true,
        message: "Photo uploaded successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to upload photo. Please try again.",
        severity: "error",
      });
    }
  };

  const { values, handleChange, handleSubmit, isLoading } =
    useForm<PhotoUploadFormValues>({
      initialValues: { description: "", tags: [] },
      onSubmit: handleUpload,
    });

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };



  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography className='sixtyfour-convergance-new' variant="h4" component="h1" gutterBottom align="center">
        Upload Photo
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        <Button
          component="label"
          variant="outlined"
          startIcon={file ? <ImageIcon /> : <CloudUploadIcon />}
          sx={{ mb: 2 }}
        >
          {file ? "Change Photo" : "Upload Photo"}
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
        </Button>
        {file && (
          <Typography variant="body2" align="center">
            Selected file: {file.name}
          </Typography>
        )}
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description"
          name="description"
          value={values.description}
          onChange={handleChange}
        />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            label="Add Tag"
            value={tagInput}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
            sx={{ flexGrow: 1, marginRight: '8px' }}
          />
          <Button variant="contained" onClick={handleAddTag}>
            Add
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleRemoveTag(tag)}
              sx={{ margin: '4px' }}
            />
          ))}
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!file || isLoading}
          startIcon={
            isLoading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isLoading ? "Uploading..." : "Upload"}
        </Button>
      </Box>
      {uploadedPhotoUrl && (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6">Uploaded Photo:</Typography>
          <img
            src={uploadedPhotoUrl}
            alt="Upload Page, Uploaded by User"
            style={{ maxWidth: "100%", height: "auto", marginTop: "16px" }}
          />
        </Box>
      )}
      {uploadedPhotos.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Your Uploaded Photos:</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {uploadedPhotos.map((photo) => (
              <Box key={photo._id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={photo.imageUrl} alt={photo.description} style={{ maxWidth: '100%', height: 'auto' }} />
                <Typography variant="body2">{photo.description}</Typography>
                <Typography variant="body2">Tags: {Array.isArray(photo?.tags) ? photo.tags.join(', ') : ''}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      <UserSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Paper>
  );
};

export default PhotoUpload;
