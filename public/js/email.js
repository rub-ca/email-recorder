// Write some div in chat list
function writeEmailDiv(email) {
    const chatList = document.getElementById('chat-list');
    const div = document.createElement('div');
    div.className = 'chat-item';
    div.innerHTML = `
        <div class="chat-item-header">
            <span class="chat-item-title">${email.subject || 'Sin asunto'}</span>
            <span class="chat-item-date">${new Date(email.date).toLocaleString()}</span>
        </div>
        <div class="chat-item-body">
            <p>${email.from} &lt;${email.to}&gt;</p>
            <p>${email.snippet}</p>
        </div>
    `;
    chatList.appendChild(div);
}

// on document load
document.addEventListener('DOMContentLoaded', () => {

    fetch('https://recorder.fuelmates.com/api/email/all', {
        method: 'GET',
        credentials: 'include' // 👈 NECESARIO para enviar cookies
    })
        .then(res => {
            console.log('Respuesta del servidor 1');
            return res.json()
        })
        .then(data => {
            console.log('Respuesta del servidor 2');
            console.log('Respuesta del servidor:', data.message)
            console.log('Respuesta del servidor:', data.emails)
        })
        .catch(err => console.error('Error:', err))


    writeEmailDiv(
        {
            subject: 'Bienvenido a nuestro servicio',
            date: '2023-10-01T12:00:00Z',
            from: ' qwed',
            to: ' qwed',
            snippet: 'Este es un mensaje de bienvenida a nuestro servicio. Esperamos que disfrutes de todas las funcionalidades que ofrecemos.'
        }
    );
    writeEmailDiv(
        {
            subject: 'Bienvenido a nuestro servicio',
            date: '2023-10-01T12:00:00Z',
            from: ' qwed',
            to: ' qwed',
            snippet: 'Este es un mensaje de bienvenida a nuestro servicio. Esperamos que disfrutes de todas las funcionalidades que ofrecemos.'
        }
    );
    writeEmailDiv(
        {
            subject: 'Bienvenido a nuestro servicio',
            date: '2023-10-01T12:00:00Z',
            from: ' qwed',
            to: ' qwed',
            snippet: 'Este es un mensaje de bienvenida a nuestro servicio. Esperamos que disfrutes de todas las funcionalidades que ofrecemos.'
        }
    );
    writeEmailDiv(
        {
            subject: 'Bienvenido a nuestro servicio',
            date: '2023-10-01T12:00:00Z',
            from: ' qwed',
            to: ' qwed',
            snippet: 'Este es un mensaje de bienvenida a nuestro servicio. Esperamos que disfrutes de todas las funcionalidades que ofrecemos.'
        }
    );
});