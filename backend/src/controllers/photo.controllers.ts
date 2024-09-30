import { Response } from 'express';
import { AuthRequest, AsyncRequestHandler } from '../types';
import Photo, { IPhoto } from '../models/photo.model';
import mongoose from 'mongoose';

export const getAllPhotos: AsyncRequestHandler = async (req, res) => {
    try {
        const photos: IPhoto[] = await Photo.find().sort({ createdAt: -1 });
        res.json(photos);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

export const uploadPhoto: AsyncRequestHandler = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ msg: 'User not authenticated' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ msg: 'No file uploaded' });
        return;
      }
  
      const newPhoto = new Photo({
        user: new mongoose.Types.ObjectId(req.user.id),
        imageUrl: `/uploads/${req.file.filename}`,
        description: req.body.description,
      });
  
      const savedPhoto: IPhoto = await newPhoto.save();
      res.json(savedPhoto);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
};
  
export const likePhoto: AsyncRequestHandler = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ msg: 'User not authenticated' });
        return;
      }
  
      const photo: IPhoto | null = await Photo.findById(req.params.id);
      if (!photo) {
        res.status(404).json({ msg: 'Photo not found' });
        return;
      }
  
      const userIdObj = new mongoose.Types.ObjectId(req.user.id);
  
      if (photo.likes.some((like) => like.equals(userIdObj))) {  
        res.status(400).json({ msg: 'Photo already liked' });
        return;
      }
  
      photo.likes.push(userIdObj);  
      await photo.save();
  
      res.json(photo.likes);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
};
  
export const bookmarkPhoto: AsyncRequestHandler = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ msg: 'User not authenticated' });
        return;
      }
  
      const photo: IPhoto | null = await Photo.findById(req.params.id);
      if (!photo) {
        res.status(404).json({ msg: 'Photo not found' });
        return;
      }
  
      const userIdObj = new mongoose.Types.ObjectId(req.user.id);
  
      if (photo.bookmarks.some((bookmark) => bookmark.equals(userIdObj))) { 
        res.status(400).json({ msg: 'Photo already bookmarked' });
        return;
      }
  
      photo.bookmarks.push(userIdObj); 
      await photo.save();
  
      res.json(photo.bookmarks);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
};