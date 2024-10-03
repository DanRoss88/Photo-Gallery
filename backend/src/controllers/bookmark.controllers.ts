import { Response } from "express";
import { AuthRequest } from "../types";
import User from "../models/user.model";
import mongoose from "mongoose";
import { AppError } from "../utils/errorHandler";
import { catchAsync } from "../utils/errorHandler";
import Photo from "../models/photo.model";

export const getUserBookmarks = catchAsync(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.params.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const totalBookmarks = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      { $project: { bookmarkCount: { $size: "$bookmarks" } } },
    ]);

    const user = await User.findById(userId).populate({
      path: "bookmarks",
      options: { skip, limit },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const total = totalBookmarks[0]?.bookmarkCount || 0;

    res.status(200).json({
      total,
      page,
      limit,
      photos: user.bookmarks,
    });
  }
);

const toggleBookmarkOnPhotoAndUser = async (
  photoId: string,
  userId: string,
  add: boolean
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const photoUpdate = add
      ? { $addToSet: { bookmarks: userId } }
      : { $pull: { bookmarks: userId } };

    const updatedPhoto = await Photo.findByIdAndUpdate(photoId, photoUpdate, {
      new: true,
      session,
    });
    if (!updatedPhoto) throw new AppError("Photo not found", 404);

    const userUpdate = add
      ? { $addToSet: { bookmarks: photoId } }
      : { $pull: { bookmarks: photoId } };

    const updatedUser = await User.findByIdAndUpdate(userId, userUpdate, {
      new: true,
      session,
    });
    if (!updatedUser) throw new AppError("User not found", 404);

    await session.commitTransaction();
    return { updatedPhoto, updatedUser };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const toggleBookmarkPhoto = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id: photoId } = req.params;
    const userId = req.user?._id;

    const { bookmark } = req.body; // Expecting a boolean value for `bookmark`

    if (!userId) throw new AppError("User not authenticated", 401);

    // Toggle bookmark on both the photo and user
    const { updatedPhoto, updatedUser } = await toggleBookmarkOnPhotoAndUser(
      photoId,
      userId.toString(),
      bookmark
    );

    res.status(200).json({
      message: bookmark
        ? "Bookmarked successfully"
        : "Unbookmarked successfully",
      data: { photo: updatedPhoto, user: updatedUser },
    });
  }
);
