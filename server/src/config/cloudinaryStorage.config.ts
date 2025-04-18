import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "./cloudinary.config";

export const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "employer-logos",
      allowed_formats: ["jpg", "jpeg", "png", "svg"],
    };
  },
});
