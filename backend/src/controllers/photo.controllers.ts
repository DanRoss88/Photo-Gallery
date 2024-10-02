import { Request, Response, NextFunction } from "express";
import { catchAsync, AppError } from "../utils/errorHandler";
import { AuthRequest, PhotoInput } from "../types";
import Photo from "../models/photo.model";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model";

export const uploadPhoto = catchAsync(async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }
  
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }
  
    const result = await cloudinary.uploader.upload(req.file.path);
    
    const newPhoto: PhotoInput = {
      user: req.user._id,
      imageUrl: result.secure_url,
      description: req.body.description,
    };
  
    const createdPhoto = await Photo.create(newPhoto);
  
    res.status(201).json({
      status: 'success',
      data: { photo: createdPhoto },
    });
  });


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

export const toggleLikePhoto = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const photoId = req.params.id;
    const { userId, like } = req.body;
  
    if (!userId) {
      throw new AppError('User ID is required', 400);
    }
  
    const update = like
      ? { $addToSet: { likes: userId } } // Add to likes if not present
      : { $pull: { likes: userId } };     // Remove from likes if present
  
    const photo = await Photo.findByIdAndUpdate(photoId, update, { new: true });
  
    if (!photo) {
      throw new AppError('Photo not found', 404);
    }
  
    res.status(200).json({
      message: like ? 'Liked successfully' : 'Unliked successfully',
      data: { photo },
    });
  });
  
  export const toggleBookmarkPhoto = catchAsync(async (req: AuthRequest, res: Response): Promise<void> => {
    const photoId = req.params.id;
    const userId = req.user._id; 
    const { bookmark } = req.body;

    if (!userId) {
        throw new AppError('User not authenticated', 401);
    }

    // Check if the photo exists
    const photo = await Photo.findById(photoId);
    if (!photo) {
        throw new AppError('Photo not found', 404);
    }

    // Determine whether to add or remove the bookmark
    if (bookmark) {
        // Add to photo's bookmarks if not already present
        if (!photo.bookmarks.includes(userId)) {
            photo.bookmarks.push(userId);
        }

        // Add to user's bookmarks if not already present
        const user = await User.findById(userId);
        if (user && !user.bookmarks.includes(photoId)) {
            user.bookmarks.push(photoId);
            await user.save(); // Save updated user bookmarks
        }
    } else {
        // Remove from photo's bookmarks
        photo.bookmarks = photo.bookmarks.filter(id => id.toString() !== userId);
        await photo.save(); // Save updated photo bookmarks

        // Remove from user's bookmarks
        const user = await User.findById(userId);
        if (user) {
            user.bookmarks = user.bookmarks.filter(id => id.toString() !== photoId);
            await user.save(); // Save updated user bookmarks
        }
    }

    res.status(200).json({
        message: bookmark ? 'Bookmarked successfully' : 'Unbookmarked successfully',
        data: { photo },
    });
});