import { Request, Response } from "express";
import { catchAsync, AppError } from "../utils/errorHandler";
import { AuthRequest  } from "../types";
import Photo from "../models/photo.model";
import User from "../models/user.model";
import mongoose from "mongoose";
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
  