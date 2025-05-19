import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDIANRY_API_SECRET,
});

interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

export const uploadToCloudinary = async (
  filepath: string
): Promise<CloudinaryUploadResult> => {
  try {
    const image: { secure_url: string; public_id: string } =
      await cloudinary.uploader.upload(filepath);

    return {
      url: image.secure_url,
      publicId: image.public_id,
    };
  } catch (error) {
    console.error('Error while uploading cloudinary', error);
    throw new Error('Error while uploading cloudinary');
  }
};
