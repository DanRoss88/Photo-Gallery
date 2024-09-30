import mongoose, { Schema, Document } from "mongoose";
export interface IPhoto extends Document {
  imageUrl: string;
  description: string;
  likes: number;
  bookmarks: number;
  user: mongoose.Types.ObjectId;
}

const PhotoSchema: Schema = new Schema({
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  likes: { type: Number, default: 0 },
  bookmarks: { type: Number, default: 0 },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
},
  { timestamps: true }
);

const Photo = mongoose.model<IPhoto>("Photo", PhotoSchema);

export default Photo;
