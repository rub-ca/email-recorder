// Write some div in chat list
function writeEmailDiv(email) {
    const chatList = document.getElementById('chat-list');
    const div = document.createElement('div');
    div.className = 'chat-item';
    div.innerHTML = `
        <div class="chat-item-header">
            <span class="chat-item-title">${email.subject || 'Sin asunto'}</span>
        </div>
        <div class="chat-item-body">
            <p>${email.from}</p>
            <p>${email.compressed}</p>
            <p>----END------</p>
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

            const emails = data.emails || [];
            emails.forEach(email => {
                writeEmailDiv({
                    subject: email.subject,
                    from: email.from,
                    compressed: email.compressed
                });
            });
        })
        .catch(err => console.error('Error:', err))


});