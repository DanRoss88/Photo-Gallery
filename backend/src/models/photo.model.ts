import mongoose, { Document, Schema } from 'mongoose';

export interface IPhoto extends Document {
  user: mongoose.Types.ObjectId;
  imageUrl: string;
  description: string;
  likes: mongoose.Types.ObjectId[];
  bookmarks: mongoose.Types.ObjectId[];
}

const PhotoSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  description: { type: String },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  bookmarks: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model<IPhoto>('Photo', PhotoSchema);