import { Response } from "express";
import { AuthRequest } from "../types";
import User from "../models/user.model";
import { AppError } from "../utils/errorHandler";
import { catchAsync } from "../utils/errorHandler";
import Photo from "../models/photo.model";

export const getUserBookmarks = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.params.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
  
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }
  
    const user = await User.findById(userId).populate({
      path: 'bookmarks',
      options: { sort: { createdAt: -1 }, skip, limit },
      populate: { path: 'user', select: 'username' },
    });
  
    if (!user) {
      throw new AppError('User not found', 404);
    }
  
    const total = user.bookmarks.length;
  
    res.status(200).json({
      status: 'success',
      results: user.bookmarks.length,
      total: total,
      data: { 
        data: user.bookmarks 
    },
    });
  });

export const toggleBookmark = catchAsync(async (req: AuthRequest, res: Response) => {
    const photoId = req.params.id;
    const userId = req.user?._id;
  
    if (!userId) {
      throw new AppError('User not authenticated', 401);
    }
  
    const photo = await Photo.findById(photoId);
    if (!photo) {
      throw new AppError('Photo not found', 404);
    }
  
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
  
    const isBookmarked = photo.bookmarkedBy.includes(user._id);
  
    if (isBookmarked) {
      // Remove bookmark
      await Photo.findByIdAndUpdate(photoId, { $pull: { bookmarkedBy: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { bookmarks: photoId } });
    } else {
      // Add bookmark
      await Photo.findByIdAndUpdate(photoId, { $addToSet: { bookmarkedBy: userId } });
      await User.findByIdAndUpdate(userId, { $addToSet: { bookmarks: photoId } });
    }
  
    const updatedPhoto = await Photo.findById(photoId).populate('user', 'username');
  
    res.status(200).json({
      status: 'success',
      data: {
        photo: updatedPhoto,
        isBookmarked: !isBookmarked,
      },
    });
  });


