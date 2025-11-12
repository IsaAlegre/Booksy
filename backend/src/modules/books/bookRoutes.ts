import { Router } from "express";
import { bookController } from "./bookController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { adminMiddleware } from "../../middleware/adminMiddleware.js";
import { bookUpload } from "../../config/multer.js"; 
import reviewRoutes from "../reviews/reviewRoutes.js";
import Busboy from "busboy";

const router = Router();

// --- RUTAS PÚBLICAS ---
router.get("/", bookController.getAll.bind(bookController));
router.get("/:id", bookController.getById.bind(bookController));

const parseFormData = (req: any, res: any, next: any) => {
  if (req.is("multipart/form-data")) {
    const bb = Busboy({ headers: req.headers }); // ✅ Usar Busboy
    req.body = {};

    bb.on("field", (fieldname: string, val: string) => {
      req.body[fieldname] = val;
    });

    bb.on("file", (fieldname: string, file: any, info: any) => {
      file.resume();
    });

    bb.on("close", () => {
      next();
    });

    bb.on("error", (err: any) => {
      next(err);
    });

    req.pipe(bb);
  } else {
    next();
  }
};

// --- RUTAS PROTEGIDAS (Solo Admins) ---

// POST /api/books - Crear libro con imagen
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  bookUpload.single("coverImage"), 
  bookController.create.bind(bookController)
);

// PUT /api/books/:id - Actualizar libro con imagen
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  bookUpload.single("coverImage"),
  bookController.update.bind(bookController)
);

// DELETE /api/books/:id - Eliminar libro
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  bookController.delete.bind(bookController)
);

// Reseñas de libros
router.use("/:bookId/reviews", reviewRoutes);

export default router;