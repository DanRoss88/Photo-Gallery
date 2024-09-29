import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import auth from "../middleware/auth";
import Photo from "../models/photo.model";

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload a photo
router.post(
  "/",
  auth,
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const newPhoto = new Photo({
        user: req.user?.id,
        imageUrl: `/uploads/${req.file?.filename}`,
        description: req.body.description,
      });

      const photo = await newPhoto.save();
      res.json(photo);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

// Get all photos
router.get("/", async (req: Request, res: Response) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Like a photo
router.put("/like/:id", auth, async (req: Request, res: Response) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ msg: "Photo not found" });
    }

    if (photo.likes.includes(req.user?.id)) {
      return res.status(400).json({ msg: "Photo already liked" });
    }

    photo.likes.push(req.user?.id);
    await photo.save();

    res.json(photo.likes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Bookmark a photo
router.put("/bookmark/:id", auth, async (req: Request, res: Response) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ msg: "Photo not found" });
    }
    if (photo.bookmarks.includes(req.user?.id)) {
      return res.status(400).json({ msg: "Photo already bookmarked" });
    }

    photo.bookmarks.push(req.user?.id);
    await photo.save();

    res.json(photo.bookmarks);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
