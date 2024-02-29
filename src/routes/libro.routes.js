import { Router } from "express";
import { upload } from '../app';

import { methods as libroController } from "./../controllers/libro.controller";
import { parse } from "dotenv";

const router = Router();

//Funcion para que no se ejecute la subida de archivos mediante form-data
const parseNone = (req, res, next) => {
    upload.none()(req, res, next);
};

router.get("/mostrar",libroController.getLibrosMostrar)
router.get("/editorial", libroController.getLibrosEditorial);
router.get("/ordenados",parseNone, libroController.getLibrosOrdenados);
router.get("/", libroController.getLibros);
router.get("/imagen/:id", libroController.getLibroImagen);
router.get("/:id", libroController.getLibro);
router.post("/aniadir", (req, res, next) => req.upload.single('imagen_blob')(req, res, next), libroController.addLibro);
router.put("/modificar/:id",parseNone, libroController.updateLibro);
router.delete("/:id", libroController.deleteLibro);

export default router;
