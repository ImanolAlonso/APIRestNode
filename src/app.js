import express from "express";
import morgan from "morgan";
import multer from 'multer';
import path from 'path';

// Routes
import libroRoutes from "./routes/libro.routes";

const app = express();


// Multer configuration
const storage = multer.diskStorage({
    //Donde quiero que se guarde la imagen (ruta)
    destination: function(req, file, cb) {
        cb(null, 'imagenes/');
    },
    //Con que nombre quiero que se guarde
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

export const upload = multer({ storage: storage });

// Settings
app.set("port", 8085);
//Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
//Maneja informacion de subida de tipo form-data y maneja archivos(imagenes)
app.use((req, res, next) => {
    req.upload = upload;
    next();
});
app.use(morgan("dev"));


// Routes
app.use("/libro",libroRoutes);

export default app;