// code Socket IO Client
// el code del cliente es practicamente igual al del server
const socketChat = io().connect();

const renderChat = (mensajes) => {
    let chat = document.getElementById('chat');

    let html = mensajes.map(msg => {
        return `   
        <span style="color: blue;"><strong>${msg.email}</strong></span>
           [<span style="color: brown;">${msg.fecha}</span>] :          
           <span style="color: green; font-style: italic">${msg.mensaje}</span>     
           <br>
        `;
    }).join('');
    chat.innerHTML = html;
}

const addMessage = (event) => {
    let email = document.querySelector('#email').value;
    let mensaje = document.querySelector('#message').value;
    const fecha = formatDate(new Date());

    const mensajeriass = { email, fecha, mensaje };

    socket.emit('mensaje-nuevo', mensajeriass);
    // clear input message
    document.querySelector('#message').value = '';
    return false;// es como el e.preventDefault();
}


// escuchamos lo que da el servidor
socket.on('mensaje-servidor-chat', (mensajes) => {
    console.log('mensaje-servidor-chat: ' + mensajes);
    renderChat(mensajes.chat);
});