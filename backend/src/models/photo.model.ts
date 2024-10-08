import mongoose, { Schema, Document } from 'mongoose';

export interface IPhoto extends Document {
  imageUrl: string;
  publicId?: string;
  description: string;
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  bookmarkedBy: mongoose.Types.ObjectId[];
  user: mongoose.Types.ObjectId;
}

const PhotoSchema: Schema = new Schema(
  {
    imageUrl: { type: String, required: true },
    publicId: { type: String },
    description: { type: String, required: true },
    tags: { type: [String], default: [] },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    bookmarkedBy: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Photo = mongoose.model<IPhoto>('Photo', PhotoSchema);

export default Photo;
