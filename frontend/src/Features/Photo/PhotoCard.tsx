import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { PhotoCardProps } from "../../types";

const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  onLike,
  onBookmark,
  currentUserId,
    isLoggedIn,
}) => {
  const isLiked = currentUserId ? photo.likes.includes(currentUserId) : false;
  const isBookmarked = currentUserId
    ? photo.bookmarks.includes(currentUserId)
    : false;

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={photo.imageUrl}
        alt={photo.description || "Photo"}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {photo.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="like"
          onClick={() => onLike(photo._id)}
          disabled={!isLoggedIn}
        >
          <FavoriteIcon color={isLiked ? "secondary" : "action"} />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {photo.likes.length}
        </Typography>
        <IconButton
          aria-label="bookmark"
          onClick={() => onBookmark(photo._id)}
          disabled={!isLoggedIn}
        >
          <BookmarkIcon color={isBookmarked ? "primary" : "action"} />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {photo.bookmarks.length}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default PhotoCard;
