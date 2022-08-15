const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const ContenedorProducto = require('./service/ContenedorProducto');
let contenedorProducto = new ContenedorProducto('data/productos.json');

const ContenedorMensaje = require('./service/ContenedorMensaje');
let contenedorMensaje = new ContenedorMensaje('data/mensajes.json');

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

io.on('connection', async(socket) => {
    console.log('a user connected ' + socket.id);
    const productos = await contenedorProducto.getAll();
    const mensaje = {
        mensaje: 'todo ok', 
        productos: productos
    };
    // envia al cliente
    socket.emit('mensaje-servidor-producto', mensaje);
  
    socket.on('producto-nuevo', async(producto) => {
        await contenedorProducto.save(producto.nombre, producto.precio, producto.foto);
        console.log('producto agregado: ', producto);
        // const productos = await contenedorProducto.getAll();
        const mensajeProducto = {
            mensaje: 'producto insertado', 
            productos
        };
        // emite a todos productos nuevos
        io.sockets.emit('mensaje-servidor-producto', mensajeProducto);
        }
    );
    /************************** Mensajes ***************************/
    const chat = await contenedorMensaje.getAll();
    console.log('contenedorMensaje.getAll >>>>>> ', chat);
    const mensajes = {
        mensaje: 'todo ok', 
        chat: chat
    };
    // envia al cliente
    socket.emit('mensaje-servidor-chat', mensajes);
  
    socket.on('mensaje-nuevo', async(mensajeriass) => {
        await contenedorMensaje.save(mensajeriass.email, mensajeriass.fecha, mensajeriass.mensaje);
        console.log('mensaje agregado: ', mensajeriass);
        // const chat = await contenedorMensaje.getAll();
        const mensajes = {
            mensaje: 'mensaje insertado', 
            chat
        };
        // emite a todos productos nuevos
        io.sockets.emit('mensaje-servidor-chat', mensajes);
        }
    );
    
});


const PORT = process.env.PORT || 3000;

//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
}).on('error', err => {
    console.log(err);
});