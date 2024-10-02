import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from './env';

const cloudName = CLOUDINARY_CLOUD_NAME
const cloudAPIKey = CLOUDINARY_API_KEY
const cloudAPISecret = CLOUDINARY_API_SECRET

cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudAPIKey,
  api_secret: cloudAPISecret,
});

export default cloudinary;