import { getConnection } from "./../database/database";
import fs from 'fs';

const getLibros = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT id,nombre,stock,imagen,editorial_id FROM libros");
        res.json(result);
    } catch (error) { 
        res.status(500);
        res.send(error.message);
    }
};

const getLibro = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT id,nombre,stock,imagen,editorial_id FROM libros WHERE id = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};
const getLibroImagen = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT imagen_blob FROM libros WHERE id = ?", id);
        //Lectura de la imagen que he conseguido con la consulta
        const imagen = Buffer.from(result[0].imagen_blob, 'base64');
        //Mostar la imagen
        res.end(imagen);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getLibrosOrdenados = async (req, res) => {
    try {
        //Parametro de ordenacion
        const orden = req.body.ordenacion;
        if(orden === undefined){
            return res.status(400).json({message: "Debe introducir un valor de orden: nombre o stock"});
        } else if (orden != 'nombre' && orden != 'stock'){
            return res.status(400).json({message: "Valor de orden no valido, debe introducir nombre o stock"});
        }
        const connection = await getConnection();
        const result = await connection.query(`SELECT id,nombre,stock,imagen,editorial_id FROM libros ORDER BY ${orden}`);
        res.json(result);
    } catch (error) { 
        console.log(error)
        res.status(500);
        res.send(error.message);
    }
};

const getLibrosMostrar = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM libros");
        res.render('index', { libros: result });
    } catch (error) { 
        res.status(500);
        res.send(error.message);
    }
};


const getLibrosEditorial = async (req,res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query(`
        SELECT e.id AS editorial_id, e.nombre_editorial AS editorial, l.id AS libro_id, l.nombre AS libro, l.stock
        FROM editoriales e
        JOIN libros l ON e.id = l.editorial_id
        ORDER BY e.id
    `);

        let editoriales = {};

        result.forEach(row => {
            //Inicializar el array de editoriales en cada posicion
            if(!editoriales[row.editorial_id]) {
                editoriales[row.editorial_id] = {
                    nombre: row.editorial,
                    libros: []
                };
            }
            //Introducir en cada posicion del array de libros que hay en editoriales cada libro que pertenezca a esa editorial
            editoriales[row.editorial_id].libros.push({
                id: row.libro_id,
                nombre: row.libro,
                stock: row.stock
            });
        });

        res.json(editoriales);
        
    } catch (error) { 
        res.status(500);
        res.send(error.message);
    }
}

const addLibro = async (req, res) => {
    try {
        //Datos requeridos para añadir un libro
        const { nombre, stock, editorial_id } = req.body;
        const imagen_b = req.file;

        if(imagen_b === undefined){
            return res.status(400).json({message: "Debe introducir una imagen"});
        }

        if(editorial_id != 1 && editorial_id != 2 && editorial_id != 3){
            return res.status(400).json({ message: "ID de editorial no valido, debe ser de 1 a 3" });
        }

        if (nombre === undefined || stock === undefined) {
            return res.status(400).json({ message: "Debe introducir un nombre o un stock" });
        }
        //Pasar la imagen que recibo a base64 para guardarla en ese formato en la base de datos
        let imagen_blob = fs.readFileSync(imagen_b.path);
        imagen_blob = imagen_blob.toString('base64');
        //Fecha actual
        let fecha_insercion = new Date(Date.now());
        let fecha_modificacion = new Date(Date.now());
        //Nombre de la imagen que me han pasado para almacenarla como string
        let imagen = imagen_b.originalname;
        //Insercion de los datos
        const libro = { nombre, stock,fecha_insercion, fecha_modificacion, editorial_id,imagen, imagen_blob };
        const connection = await getConnection();
        await connection.query("INSERT INTO libros SET ?", libro);
        res.json({ message: "Libro agregado" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const updateLibro = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, stock, editorial_id } = req.body;

        if (id === undefined || nombre === undefined || stock === undefined || editorial_id === undefined) {
            res.status(400).json({ message: "Falta algun campo" });
        }

        const libro = { nombre, stock, editorial_id };
        const connection = await getConnection();
        const result = await connection.query("UPDATE libros SET ? WHERE id = ?", [libro, id]);
        res.json("Libro con id " + id +" modificado correctamente");
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const deleteLibro = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM libros WHERE id = ?", id);
        res.json("Libro con id " + id + " eliminado");
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const methods = {
    getLibros,
    getLibro,
    addLibro,
    getLibroImagen,
    getLibrosOrdenados,
    getLibrosEditorial,
    getLibrosMostrar,
    updateLibro,
    deleteLibro
};