import { Request, Response } from "express";
import { catchAsync, AppError } from "../utils/errorHandler";
import { AuthRequest  } from "../types";
import Photo from "../models/photo.model";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model";
import { Types } from "mongoose";
import { updateAction } from "../utils/helpers";


export const getAllPhotos = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const photos = await Photo.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Photo.countDocuments();  

  res.status(200).json({
    status: 'success',
    results: photos.length,
    total,
    data: { photos },
  });
});

export const toggleLikePhoto = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const { id: photoId } = req.params;
      const { userId, like } = req.body;
  
      if (!userId) {
        throw new AppError("User ID is required", 400);
      }
  
      const photo = await updateAction(photoId, userId, "likes", like);
  
      res.status(200).json({
        message: like ? "Liked successfully" : "Unliked successfully",
        data: { photo },
      });
    }
  );
  

  const toggleBookmarkOnPhotoAndUser = async (photoId: Types.ObjectId, userId: Types.ObjectId, add: boolean) => {
    // Update the photo's bookmarks
    const photoUpdate = add
      ? { $addToSet: { bookmarks: userId } }
      : { $pull: { bookmarks: userId } };
  
    const updatedPhoto = await Photo.findByIdAndUpdate(photoId, photoUpdate, { new: true });
    if (!updatedPhoto) throw new AppError("Photo not found", 404);
  
    // Update the user's bookmarks
    const userUpdate = add
      ? { $addToSet: { bookmarks: photoId } }
      : { $pull: { bookmarks: photoId } };
  
    const updatedUser = await User.findByIdAndUpdate(userId, userUpdate, { new: true });
    if (!updatedUser) throw new AppError("User not found", 404);
  
    return { updatedPhoto, updatedUser };
  };
  
  export const toggleBookmarkPhoto = catchAsync(async (req: AuthRequest, res: Response) => {
    const { id: photoId } = req.params;
    const userId = req.user?._id;  // req.user is properly typed here
  
    const { bookmark } = req.body; // Expecting a boolean value for `bookmark`
  
    if (!userId) throw new AppError("User not authenticated", 401);
  
    // Toggle bookmark on both the photo and user
    const { updatedPhoto } = await toggleBookmarkOnPhotoAndUser(
      new Types.ObjectId(photoId),
      new Types.ObjectId(userId),
      bookmark
    );
  
    res.status(200).json({
      message: bookmark ? "Bookmarked successfully" : "Unbookmarked successfully",
      data: { photo: updatedPhoto },
    });
  });