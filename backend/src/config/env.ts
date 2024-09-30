import * as dotenv from "dotenv";
dotenv.config();

const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (typeof value === "undefined") {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

export const MONGO_URI = getEnvVariable("MONGO_URI");
export const JWT_SECRET = getEnvVariable("JWT_SECRET");
export const PORT = getEnvVariable("PORT", "5000");
export const CLOUDINARY_CLOUD_NAME = getEnvVariable("CLOUDINARY_CLOUD_NAME");
export const CLOUDINARY_API_KEY = getEnvVariable("CLOUDINARY_API_KEY");
export const CLOUDINARY_API_SECRET = getEnvVariable("CLOUDINARY_API_SECRET");