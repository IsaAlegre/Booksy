import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "booksy/profile_pictures", // Carpeta en Cloudinary
    resource_type: "auto", // Auto-detecta el tipo de archivo
    allowed_formats: ["jpg", "jpeg", "png", "webp"], // Formatos permitidos
    quality: "auto", // Optimización automática
    fetch_format: "auto", // Formato óptimo para el navegador
  } as any,
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Máximo 5MB
  },
  fileFilter: (req, file, cb) => {
    // Validar tipos MIME
    const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos de imagen (JPG, PNG, WebP)"));
    }
  },
});

export default upload;