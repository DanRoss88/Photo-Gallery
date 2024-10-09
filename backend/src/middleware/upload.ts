import multer from "multer";
import path from "path";
import { Response } from "express";
import fs from "fs";
import cloudinary from "../config/cloudinary";
import Photo from "../models/photo.model";
import { catchAsync, AppError } from "../utils/errorHandler";
import { AuthRequest } from "../types";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads/");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

export const upload = multer({ storage });

export const uploadPhoto = catchAsync(
  async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      throw new AppError("No file uploaded", 400);
    }
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `photo-app/user_photos/${req.user._id}`,
      resource_type: "image",
    });

    // Remove file from local disk after upload
    fs.unlinkSync(req.file.path);
    const tags = req.body['tags[]']
    const photoTags = Array.isArray(tags) ? tags : tags.split(',');
    console.log(tags);
    const newPhoto = {
      user: req.user._id,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      description: req.body.description,
      tags: photoTags
    };
    const createdPhoto = await Photo.create(newPhoto); // Save to the database (assuming you have a Photo model)

    res.status(201).json({
      status: "success",
      data: {
        photo: {
          id: createdPhoto._id,
          imageUrl: result.secure_url, // Return the uploaded image URL
          description: req.body.description,
          tags: photoTags
        },
      },
    });
  }
);
