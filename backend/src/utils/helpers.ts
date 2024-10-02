import Photo from "../models/photo.model";
import { AppError } from "./errorHandler";

export const validateRequiredFields = (data: any, requiredFields: string[]): string | null => {
    for (const field of requiredFields) {
      if (!data[field]) {
        return `${field} is required`;
      }
    }
    return null;
  };

export const updateAction = async (
    itemId: string,
    userId: string,
    action: "likes" | "bookmarks",
    add: boolean
  ) => {
    const update = add
      ? { $addToSet: { [action]: userId } }
      : { $pull: { [action]: userId } };
  
    const item = await Photo.findByIdAndUpdate(itemId, update, { new: true });
  
    if (!item) {
      throw new AppError(`${action === "likes" ? "Photo" : "User"} not found`, 404);
    }
    return item;
  };