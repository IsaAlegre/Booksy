import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const profilePictureStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "booksy/profile_pictures",
    resource_type: "auto",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    quality: "auto",
    fetch_format: "auto",
  } as any,
});

const upload = multer({
  storage: profilePictureStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Máximo 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos de imagen (JPG, PNG, WebP)"));
    }
  },
});
// --- CONFIGURACIÓN PARA PORTADAS DE LIBROS ---
const bookCoverStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "booksy/book_covers",
    resource_type: "auto",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    quality: "auto",
    fetch_format: "auto",
  } as any,
});

const bookUpload = multer({
  storage: bookCoverStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, and WebP images are allowed"));
    }
  },
});

export { upload, bookUpload };