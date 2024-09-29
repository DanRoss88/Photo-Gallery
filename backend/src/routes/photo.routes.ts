import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadPhoto, getAllPhotos, likePhoto, bookmarkPhoto } from '../controllers/photo.controllers';
import auth from '../middleware/auth';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/', auth, upload.single('image'), uploadPhoto);
router.get('/', getAllPhotos);
router.put('/like/:id', auth, likePhoto);
router.put('/bookmark/:id', auth, bookmarkPhoto);

export default router;