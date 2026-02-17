// This is a conceptual implementation using a hypothetical Cloudinary SDK
// npm install cloudinary

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (fileBase64: string) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: 'devcanvas_projects',
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw new Error('Image upload failed');
  }
};
