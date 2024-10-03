import { Request, Response } from "express";
import { catchAsync, AppError } from "../utils/errorHandler";
import Photo from "../models/photo.model";
import { updateAction } from "../utils/helpers";

export const getAllPhotos = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const totalPhotos = await Photo.countDocuments();

  const photos = await Photo.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "success",
    results: photos.length,
    total: totalPhotos,
    data: {
      data: photos,
    },
  });
});

export const toggleLikePhoto = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id: photoId } = req.params;
    const { userId, like } = req.body;

    if (!userId) {
      throw new AppError("User ID is required", 400);
    }
    if (typeof like !== "boolean") {
        throw new AppError("Like status (true/false) is required", 400);
    }
    const photo = await updateAction(photoId, userId, "likes", like);

    res.status(200).json({
      status: "success",
      data: {
        photo: photo,
      },
    });
  }
);

export const searchPhotos = catchAsync(async (req: Request, res: Response) => {
    const { query } = req.query; // e.g., "nature"
    const tags = typeof query === 'string' ? query.split(",") : [];
    const photos = await Photo.find({
      tags: { $in: tags }, 
    });
  
    res.status(200).json({
      status: "success",
      results: photos.length,
      data: { data: photos },
    });
  });