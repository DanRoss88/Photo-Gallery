import express from 'express';
import auth from '../middleware/auth';
import upload from '../middleware/upload';
import { uploadPhoto, getAllPhotos, likePhoto, bookmarkPhoto } from '../controllers/photo.controllers';
import { verifyToken } from '../controllers/user.controllers';

const router = express.Router();

router.post('/upload', auth, upload.single('image'), uploadPhoto);
router.get('/', getAllPhotos);
router.put('/like/:id', auth, likePhoto);
router.put('/bookmark/:id', auth, bookmarkPhoto);

export default router;