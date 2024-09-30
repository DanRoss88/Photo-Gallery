import multer from 'multer';
import path from 'path';

// Multer configuration to store files temporarily in `uploads/`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/'));  // Temporary storage on disk
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Create the `upload` middleware
const upload = multer({ storage });

export default upload;