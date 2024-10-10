import Photo from '../models/photo.model';

export const validateRequiredFields = (data: any, requiredFields: string[]): string | null => {
  for (const field of requiredFields) {
    if (!data[field]) {
      return `${field} is required`;
    }
  }
  return null;
};

export const updateAction = async (
  photoId: string,
  userId: string,
  actionField: 'likes' | 'bookmarkedBy',
  action: boolean
) => {
  const update = action ? { $addToSet: { [actionField]: userId } } : { $pull: { [actionField]: userId } };

  const updatedPhoto = await Photo.findByIdAndUpdate(photoId, update, {
    new: true,
  });

  return updatedPhoto;
};
