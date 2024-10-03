import express from 'express';
import {auth} from '../middleware/auth';
import { uploadPhoto, upload } from '../middleware/upload';
import { getAllPhotos, toggleLikePhoto } from '../controllers/photo.controllers';
import { toggleBookmarkPhoto } from '../controllers/bookmark.controllers';

const router = express.Router();

router.post('/upload', auth, upload.single('image'), uploadPhoto);
router.get('/', getAllPhotos);
router.put('/like/:id', auth, toggleLikePhoto);
router.put('/bookmark/:id', auth, toggleBookmarkPhoto);

export default router;