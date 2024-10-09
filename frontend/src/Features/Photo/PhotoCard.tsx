import { FC } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { PhotoCardProps } from "../../types";

const PhotoCard: FC<PhotoCardProps> = ({
  photo,
  onLike,
  onBookmark,
  currentUserId,
}) => {
  const isLiked = currentUserId ? photo.likes.includes(currentUserId) : false;
  const isBookmarked = currentUserId
    ? photo.bookmarkedBy.includes(currentUserId)
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
        <Typography
          className="inconsolata-card-text"
          variant="body2"
          color="text.secondary"
        >
          {photo.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="like"
          onClick={() => onLike(photo._id)}
          disabled={!currentUserId}
        >
          <FavoriteIcon color={isLiked ? "secondary" : "action"} />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {photo.likes.length}
        </Typography>
        <IconButton aria-label="bookmark" onClick={() => onBookmark(photo._id)}>
          {isBookmarked ? <Bookmark color="primary" /> : <BookmarkBorder />}
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {photo.bookmarkedBy.length}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default PhotoCard;
