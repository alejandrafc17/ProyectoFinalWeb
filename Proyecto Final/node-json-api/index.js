// Librerías externas
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Módulos internos
const { readFile, writeFile } = require('./src/files');

const app = express();
const FILE_NAME = './db/pcs.txt'; // Cambiado de 'books.txt' a 'pcs.txt'

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Rutas DE PRUEBA
app.get('/hola/:name', (req, res) => {
    console.log(req);
    const name = req.params.name;
    const type = req.query.type;
    const formal = req.query.formal;
    res.send(`Hello ${formal ? 'Mr.' : ''} ${name} ${type ? ' ' + type : ''}`);
});

app.get('/read-file', (req, res) => {
    const data = readFile(FILE_NAME);
    res.send(data);
});

// API
// Listar PCs
app.get('/pcs', (req, res) => { // Cambiado de '/books' a '/pcs'
    const data = readFile(FILE_NAME);
    res.json(data);
});

// Crear PCs
app.post('/pcs', (req, res) => { // Cambiado de '/books' a '/pcs'
    try {
        // Leer el archivo de PCs
        const data = readFile(FILE_NAME);
        // Agregar la nueva PC (Agregar ID)
        const newPc = req.body; // Cambiado de 'newBook' a 'newPc'
        newPc.id = uuidv4();
        console.log(newPc);
        data.push(newPc);
        // Escribir en el archivo
        writeFile(FILE_NAME, data);
        res.json({ ok: true, message: 'La PC fue creada con éxito' });
    } catch (error) {
        console.error(error);
        res.json({ ok: false, message: 'Error al almacenar la PC' });
    }
});

// Obtener una sola PC
app.get('/pcs/:id', (req, res) => { // Cambiado de '/books/:id' a '/pcs/:id'
    console.log(req.params.id);
    // Guardar el ID
    const id = req.params.id;
    // Leer el contenido del archivo
    const pcs = readFile(FILE_NAME); // Cambiado de 'books' a 'pcs'
    // Buscar la PC con el ID que recibimos
    const pcFound = pcs.find(pc => pc.id === id); // Cambiado de 'book' a 'pc'
    if (!pcFound) { // Si no se encuentra la PC con ese ID
        res.status(404).json({ 'ok': false, message: "PC not found" });
        return;
    }
    res.json({ 'ok': true, pc: pcFound });
});

// Actualizar una PC
app.put('/pcs/:id', (req, res) => { // Cambiado de '/books/:id' a '/pcs/:id'
    console.log(req.params.id);
    // Guardar el ID
    const id = req.params.id;
    // Leer el contenido del archivo
    const pcs = readFile(FILE_NAME); // Cambiado de 'books' a 'pcs'
    // Buscar la PC con el ID que recibimos
    const pcIndex = pcs.findIndex(pc => pc.id === id); // Cambiado de 'bookIndex' a 'pcIndex'
    if (pcIndex < 0) { // Si no se encuentra la PC con ese ID
        res.status(404).json({ 'ok': false, message: "PC not found" });
        return;
    }
    let pc = pcs[pcIndex]; // Sacar del arreglo
    pc = { ...pc, ...req.body };
    pcs[pcIndex] = pc; // Poner la PC en el mismo lugar
    writeFile(FILE_NAME, pcs);
    // Si la PC existe, modificar sus datos y almacenarla nuevamente
    res.json({ 'ok': true, pc: pc });
});

// Eliminar una PC
app.delete('/pcs/:id', (req, res) => { // Cambiado de '/books/:id' a '/pcs/:id'
    console.log(req.params.id);
    // Guardar el ID
    const id = req.params.id;
    // Leer el contenido del archivo
    const pcs = readFile(FILE_NAME); // Cambiado de 'books' a 'pcs'
    // Buscar la PC con el ID que recibimos
    const pcIndex = pcs.findIndex(pc => pc.id === id); // Cambiado de 'bookIndex' a 'pcIndex'
    if (pcIndex < 0) { // Si no se encuentra la PC con ese ID
        res.status(404).json({ 'ok': false, message: "PC not found" });
        return;
    }
    // Eliminar la PC que esté en la posición pcIndex
    pcs.splice(pcIndex, 1);
    writeFile(FILE_NAME, pcs);
    res.json({ 'ok': true });
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
