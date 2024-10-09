import { Request, Response } from "express";
import { catchAsync, AppError } from "../utils/errorHandler";
import Photo from "../models/photo.model";
import { updateAction } from "../utils/helpers";
import { AuthRequest } from "../types";
import cloudinary from "../config/cloudinary";

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
  const { query, page = 1, limit = 10 } = req.query as {
    query?: string;
    page?: number;
    limit?: number;
  };

  console.log('Received search query:', query);

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  const tags = typeof query === "string" ? query.split(",") : [];
  const skip = (pageNumber - 1) * limitNumber;

  const photos = await Photo.find({ tags: { $in: tags } })
    .skip(skip)
    .limit(limitNumber);

  res.status(200).json({
    status: "success",
    results: photos.length,
    data: { data: photos },
  });
});

export const getUserPhotos = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const photos = await Photo.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: photos.length,
      data: { photos },
    });
  }
);

export const updatePhotoDetails = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { description, tags } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const photo = await Photo.findOne({ _id: id, user: userId });

    if (!photo) {
      throw new AppError(
        "Photo not found or you do not have permission to edit it",
        404
      );
    }

    photo.description = description;
    photo.tags = Array.isArray(tags) ? tags : tags.split(',');

    await photo.save();

    res.status(200).json({
      status: "success",
      data: { photo },
    });
  }
);

export const deletePhoto = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const photo = await Photo.findOne({ _id: id, user: userId });

    if (!photo) {
      throw new AppError(
        "Photo not found or you do not have permission to delete it",
        404
      );
    }

    // Delete from Cloudinary
    if (photo.publicId) {
      await cloudinary.uploader.destroy(photo.publicId);
    }

    // Delete from database
    await photo.deleteOne({
        _id: id,
        user: userId,
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
