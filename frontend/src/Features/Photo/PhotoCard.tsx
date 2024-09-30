import React, { useContext } from "react";
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
import { AuthContext } from "../../App";
import { PhotoCardProps } from "../../types";

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onLike, onBookmark }) => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={`http://localhost:5000${photo.imageUrl}`}
        alt={photo.description}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {photo.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="like"
          onClick={() => isLoggedIn && onLike(photo._id)}
          disabled={!isLoggedIn}
        >
          <FavoriteIcon
            color={
              photo.likes.includes("currentUserId") ? "secondary" : "action"
            }
          />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {photo.likes.length}
        </Typography>
        <IconButton
          aria-label="bookmark"
          onClick={() => isLoggedIn && onBookmark(photo._id)}
          disabled={!isLoggedIn}
        >
          <BookmarkIcon
            color={
              photo.bookmarks.includes("currentUserId") ? "primary" : "action"
            }
          />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {photo.bookmarks.length}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default PhotoCard;
