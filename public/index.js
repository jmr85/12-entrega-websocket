// code Socket IO Client
// el code del cliente es practicamente igual al del server
const socket = io().connect();
     
const render = (productos) => {
    let tablaListado = document.getElementById('tablaListado');
    // if(!productos.length){ 
    //     tablaListado.setAttribute('class', 'alert alert-warning w-50 mx-auto text-center');
    //     tablaListado.setAttribute('role', 'alert');
    //     tablaListado.innerHTML = '<strong>No hay productos</strong>';
    // }
    // tablaListado.style.display = 'table';
    productos.length? tablaListado.style.display = 'table' :  tablaListado.style.display = 'none';
    
    let listado = document.getElementById('listado');

    let html = productos.map(producto => {
        // isPhoto pregunta si tiene una de esas extensiones, si no tiene la extension, le agrega solo texto
        // si tiene extension va con el <img> y si el campo esta vacio va el texto del nombre de producto
        const isPhoto = producto.foto.includes(".png")
            || producto.foto.includes(".jpg")
            || producto.foto.includes(".gif")
            || producto.foto.includes(".webp") 
            ?
            `<img src="${producto.foto}" width="50em" height="50em"/> ` : `${producto.foto}` ? `${producto.foto}`: `${producto.nombre}`;

        return `   
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.precio}</td>           
                <td>${isPhoto}</td>      
            </tr>  
        `;
    }).join('');
    listado.innerHTML = html;
}
const addProduct = (e) => {
    // event.preventDefault();
    let nombre = document.querySelector('#nombre').value;
    let precio = document.querySelector('#precio').value;
    let foto = document.querySelector('#foto').value ? document.querySelector('#foto').value : nombre;
    const productoss = { nombre, precio, foto};

    socket.emit('producto-nuevo', productoss);
    // clear inputs
    document.querySelector('#nombre').value = '';
    document.querySelector('#precio').value = '';
    document.querySelector('#foto').value = '';
    return false;// es como el e.preventDefault();
}

// escuchamos lo que da el servidor
socket.on('mensaje-servidor', (mensaje) => {
    // console.log('mensaje-servidor: ' + mensaje);
    render(mensaje.productos);
});