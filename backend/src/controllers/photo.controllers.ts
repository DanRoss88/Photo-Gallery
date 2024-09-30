import { Request, Response, NextFunction } from "express";
import { catchAsync, AppError } from "../utils/errorHandler";
import { AuthRequest, PhotoInput } from "../types";
import Photo from "../models/photo.model";
import { v2 as cloudinary } from "cloudinary";

export const uploadPhoto = catchAsync(async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }
  
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }
  
    const result = await cloudinary.uploader.upload(req.file.path);
    
    const newPhoto: PhotoInput = {
      user: req.user.id,
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
    const photos = await Photo.find().sort({ createdAt: -1 });
  
    res.status(200).json({
      status: 'success',
      results: photos.length,
      data: { photos },
    });
  });
  
  export const likePhoto = catchAsync(async (req: AuthRequest, res: Response) => {
    const photo = await Photo.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true, runValidators: true }
    );
  
    if (!photo) {
      throw new AppError('No photo found with that ID', 404);
    }
  
    res.status(200).json({
      status: 'success',
      data: { photo },
    });
  });
  
  export const bookmarkPhoto = catchAsync(async (req: AuthRequest, res: Response) => {
    const photo = await Photo.findByIdAndUpdate(
      req.params.id,
      { $inc: { bookmarks: 1 } },
      { new: true, runValidators: true }
    );
  
    if (!photo) {
      throw new AppError('No photo found with that ID', 404);
    }
  
    res.status(200).json({
      status: 'success',
      data: { photo },
    });
  });
  