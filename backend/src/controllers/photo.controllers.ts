import { Response } from 'express';
import { AuthRequest } from '../types';
import Photo from '../models/photo.model';
import mongoose from 'mongoose';

export const uploadPhoto = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }

    const newPhoto = new Photo({
      user: new mongoose.Types.ObjectId(req.user.id),
      imageUrl: `/uploads/${req.file?.filename}`,
      description: req.body.description,
    });

    const photo = await newPhoto.save();
    res.json(photo);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const likePhoto = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }

    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ msg: 'Photo not found' });
    }

    if (photo.likes.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Photo already liked' });
    }

    photo.likes.push(new mongoose.Types.ObjectId(req.user.id));
    await photo.save();

    res.json(photo.likes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const bookmarkPhoto = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }

    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ msg: 'Photo not found' });
    }

    if (photo.bookmarks.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Photo already bookmarked' });
    }

    photo.bookmarks.push(new mongoose.Types.ObjectId(req.user.id));
    await photo.save();

    res.json(photo.bookmarks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};