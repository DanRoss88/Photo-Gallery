import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user.model";
export interface IPhoto extends Document {
  imageUrl: string;
  publicId?: string;
  description: string;
  likes: mongoose.Types.ObjectId[] | IUser[];
  bookmarks: mongoose.Types.ObjectId[]| IUser[];
  user: mongoose.Types.ObjectId| IUser;
}

const PhotoSchema: Schema = new Schema({
  imageUrl: { type: String, required: true },
  publicId: { type: String },
  description: { type: String, required: true },
  likes: [{ type: mongoose.Types.ObjectId, ref: "User"}],
  bookmarks: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
},
  { timestamps: true }
);

const Photo = mongoose.model<IPhoto>("Photo", PhotoSchema);

export default Photo;
